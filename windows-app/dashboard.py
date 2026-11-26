"""
PySide6 desktop dashboard — clean, modern, dark saffron theme.

Shows: engine status, today's X/7 topic coverage, remaining, topic-wise bars, views,
history, duplicates skipped, failed, last scan, next scan.
Buttons: Start/Stop · Run Search Now · Open Download Folder ·
         View Download History · Configure API Keys · Configure Topics.
"""
from __future__ import annotations

import os
import subprocess
import sys
from datetime import datetime

from PySide6.QtCore import Qt, QTimer, Signal, QObject
from PySide6.QtGui import QColor, QPalette
from PySide6.QtWidgets import (
    QApplication, QDialog, QGridLayout, QHBoxLayout, QLabel, QLineEdit,
    QListWidget, QListWidgetItem, QMainWindow, QProgressBar, QPushButton,
    QTableWidget, QTableWidgetItem, QVBoxLayout, QWidget, QDialogButtonBox,
)

import db
import engine
from ai_providers import PROVIDERS, active, get_key, save_key, set_active, masked
from config import DAILY_LIMIT, DOWNLOAD_ROOT, TOPICS, IST

STYLES = """
QMainWindow, QDialog { background:#0c0805; color:#f6ecdc; font-family:'Segoe UI'; }
QPushButton { background:rgba(233,180,76,.08); color:#e9b44c; border:1px solid #3a2c17;
  border-radius:10px; padding:10px 14px; font-weight:600; }
QPushButton:hover { background:rgba(255,138,31,.18); color:#fff; }
QPushButton#primary { background:qlineargradient(x1:0,y1:0,x2:1,y2:0,stop:0 #ff8a1f, stop:1 #e05a2b);
  color:#1b0f04; font-weight:700; }
QProgressBar { border:1px solid #3a2c17; border-radius:8px; height:22px; text-align:center;
  background:#141009; color:#f6ecdc; font-weight:700; }
QProgressBar::chunk { background:qlineargradient(x1:0,y1:0,x2:1,y2:0,stop:0 #ff8a1f,stop:1 #e9b44c);
  border-radius:7px; }
QLabel#h1 { font-size:26px; font-weight:700; color:#f6ecdc; }
QLabel#hindi { color:#e9b44c; font-size:13px; }
QLabel#dim { color:#7a6b52; font-size:12px; }
QLabel#big { font-size:44px; font-weight:800; color:#ff8a1f; }
QListWidget, QTableWidget { background:#100c07; border:1px solid #2a2113; border-radius:10px; }
QHeaderView::section { background:#1c150c; color:#e9b44c; border:none; padding:6px; }
"""


class Bridge(QObject):
    log = Signal(str, str)
    tick = Signal()


class ApiKeyDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Configure API Keys  (optional — downloader works without AI)")
        lay = QVBoxLayout(self)
        lay.addWidget(QLabel("Free-tier keys · stored locally only · engine falls back gracefully"))
        self.edits = {}
        for name, provider in PROVIDERS.items():
            row = QHBoxLayout()
            row.addWidget(QLabel(f"{provider.__class__.__name__.replace('Provider','')}  [{masked(name)}]"))
            e = QLineEdit()
            e.setEchoMode(QLineEdit.Password)
            e.setPlaceholderText("paste new key…")
            self.edits[name] = e
            row.addWidget(e)
            use = QPushButton("Set active")
            use.clicked.connect(lambda _=False, n=name: (set_active(n), self.reject(), ApiKeyDialog(self.parent()).exec()))
            row.addWidget(use)
            lay.addLayout(row)
        bb = QDialogButtonBox(QDialogButtonBox.Save | QDialogButtonBox.Close)
        bb.accepted.connect(self.save)
        bb.rejected.connect(self.reject)
        lay.addWidget(bb)
        self.setMinimumWidth(560)

    def save(self):
        for name, e in self.edits.items():
            if e.text().strip():
                save_key(name, e.text())
        self.accept()


class Dashboard(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("ViralDarshan — Vrindavan Viral Reel Seva")
        self.resize(1020, 760)
        self.bridge = Bridge()
        self.bridge.log.connect(self._append_log)
        self.bridge.tick.connect(self.refresh)
        self._running = True

        w = QWidget(); lay = QVBoxLayout(w); self.setCentralWidget(w)

        head = QHBoxLayout()
        title = QVBoxLayout()
        h1 = QLabel("ViralDarshan"); h1.setObjectName("h1")
        hin = QLabel("AI reel intelligence · 7 topics · one approved video each · >1,000,000 views"); hin.setObjectName("dim")
        title.addWidget(h1); title.addWidget(hin)
        head.addLayout(title); head.addStretch()
        self.status_lbl = QLabel("RUNNING"); self.status_lbl.setStyleSheet(
            "color:#9fd4ac;font-weight:700;padding:6px 12px;border:1px solid #2e4636;border-radius:10px;")
        head.addWidget(self.status_lbl)
        lay.addLayout(head)

        grid = QGridLayout()
        self.progress = QProgressBar(); self.progress.setMaximum(DAILY_LIMIT)
        self.big = QLabel("0 / 10"); self.big.setObjectName("big")
        left = QVBoxLayout(); left.addWidget(self.big); left.addWidget(self.progress)
        self.remaining = QLabel(); self.remaining.setObjectName("dim")
        left.addWidget(self.remaining)
        grid.addLayout(left, 0, 0)

        self.topic_labels: dict[str, QLabel] = {}
        right = QVBoxLayout()
        for t in TOPICS:
            l = QLabel(); l.setObjectName("dim"); self.topic_labels[t["slug"]] = l
            right.addWidget(l)
        grid.addLayout(right, 0, 1)
        lay.addLayout(grid)

        self.stats = QLabel(); self.stats.setObjectName("dim"); lay.addWidget(self.stats)

        btns = QHBoxLayout()
        self.btn_toggle = QPushButton("Stop"); self.btn_toggle.clicked.connect(self.toggle)
        scan = QPushButton("Run Search Now"); scan.setObjectName("primary")
        scan.clicked.connect(lambda: engine.run_scan("manual", on_log=self.bridge.log.emit))
        openf = QPushButton("Open Download Folder"); openf.clicked.connect(self.open_folder)
        hist = QPushButton("View Download History"); hist.clicked.connect(self.show_history)
        keys = QPushButton("Configure API Keys"); keys.clicked.connect(lambda: ApiKeyDialog(self).exec())
        topics = QPushButton("Configure Topics"); topics.clicked.connect(self.show_topics)
        for b in (self.btn_toggle, scan, openf, hist, keys, topics):
            btns.addWidget(b)
        lay.addLayout(btns)

        self.console = QListWidget(); lay.addWidget(self.console)

        self.timer = QTimer(self); self.timer.timeout.connect(self.refresh); self.timer.start(4000)
        self.refresh()
        for row in db.recent_logs(200)[-40:]:
            self._append_log(row["level"], row["message"])

    # ---------------- actions ----------------
    def toggle(self):
        self._running = not self._running
        self.btn_toggle.setText("Stop" if self._running else "Start")
        self.status_lbl.setText("RUNNING" if self._running else "STOPPED")

    def open_folder(self):
        os.makedirs(DOWNLOAD_ROOT, exist_ok=True)
        os.startfile(DOWNLOAD_ROOT)  # type: ignore[attr-defined]  (Windows)

    def show_history(self):
        dlg = QDialog(self); dlg.setWindowTitle("Download History — permanent cache")
        lay = QVBoxLayout(dlg)
        table = QTableWidget(0, 6)
        table.setHorizontalHeaderLabels(["Date (IST)", "Topic", "Caption", "Views", "File", "SHA-256"])
        for r in db.history(300):
            row = table.rowCount(); table.insertRow(row)
            for col, val in enumerate([
                r["ist_date"], r["topic"], (r["caption"] or "")[:60],
                f"{r['view_count']:,}", os.path.basename(r["file_path"] or ""),
                (r["file_hash"] or "")[:12],
            ]):
                table.setItem(row, col, QTableWidgetItem(str(val)))
        lay.addWidget(table); dlg.resize(860, 480); dlg.exec()

    def show_topics(self):
        dlg = QDialog(self); dlg.setWindowTitle("Monitored Topics & Keywords")
        lay = QVBoxLayout(dlg)
        for t in TOPICS:
            lay.addWidget(QLabel(f"<b>{t['name']}</b> → Downloads/Instagram_Viral_Videos/{t['folder']}/"))
            lay.addWidget(QLabel("   " + " · ".join(t["keywords"])))
        lay.addWidget(QLabel("Edit keyword matrix in config.py — changes persist across updates."))
        dlg.resize(640, 520); dlg.exec()

    # ---------------- refresh ----------------
    def _append_log(self, level: str, msg: str):
        item = QListWidgetItem(f"[{datetime.now():%H:%M:%S}] {msg}")
        colors = {"ok": QColor("#9fd4ac"), "warn": QColor("#e9b44c"),
                  "error": QColor("#ff7a55"), "info": QColor("#b9a98e")}
        item.setForeground(colors.get(level, colors["info"]))
        self.console.addItem(item)
        self.console.scrollToBottom()

    def refresh(self):
        done, by_topic = engine.today_counts()
        s = db.stats()
        self.big.setText(f"{done} / {DAILY_LIMIT}")
        self.progress.setValue(done)
        self.remaining.setText(
            f"Remaining today: {max(0, DAILY_LIMIT - done)} · duplicates skipped: {s['duplicates']} · "
            f"failed: {s['failed']} · lifetime: {s['lifetime']}")
        for t in TOPICS:
            n = by_topic.get(t["slug"], 0)
            self.topic_labels[t["slug"]].setText(f"{t['name']:<28} {n} video{'s' if n != 1 else ''}")
        now = datetime.now(IST)
        self.stats.setText(f"IST {now:%a %d %b %Y · %H:%M:%S}  —  counter resets 00:00 IST · "
                           f"permanent cache never resets  |  DB: {db.DB_PATH}")


def run_dashboard() -> int:
    app = QApplication(sys.argv)
    app.setStyleSheet(STYLES)
    pal = app.palette(); pal.setColor(QPalette.Window, QColor("#0c0805")); app.setPalette(pal)
    win = Dashboard(); win.show()
    return app.exec()
