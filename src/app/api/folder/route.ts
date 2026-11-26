import { spawn } from "node:child_process";
import fs from "node:fs";
import { NextResponse } from "next/server";
import { istDate } from "@/lib/ist";
import { dailyDownloadFolder } from "@/lib/instagram-real";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Opens today's one real-video folder on the same computer running npm dev. */
export async function POST() {
  const folder = dailyDownloadFolder(istDate());
  await fs.promises.mkdir(folder, { recursive: true });
  try {
    const command =
      process.platform === "win32" ? "explorer.exe" : process.platform === "darwin" ? "open" : "xdg-open";
    const child = spawn(command, [folder], { detached: true, stdio: "ignore" });
    child.unref();
    return NextResponse.json({ ok: true, folder });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      folder,
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
