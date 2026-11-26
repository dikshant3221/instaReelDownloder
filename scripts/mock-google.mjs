// Local mock of Google OAuth + YouTube Data API for end-to-end testing.
// Usage: node scripts/mock-google.mjs [port] [noloc]
//   noloc mode: videos.list returns NO location until a videos.update (PUT)
//   sets it — exercises the location read-back + repair path.
import http from "node:http";

const port = Number(process.argv[2] ?? 4590);
const mode = process.argv[3] ?? "normal"; // normal | noloc | hasit
let locationStored = mode !== "noloc";

const INDIA = { latitude: 20.5937, longitude: 78.9629, altitude: 0 };

const server = http.createServer((req, res) => {
  let body = Buffer.alloc(0);
  req.on("data", (c) => (body = Buffer.concat([body, c])));
  req.on("end", () => {
    const url = req.url ?? "";

    if (url.includes("/token")) {
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(JSON.stringify({ access_token: "fresh-token", expires_in: 3600, refresh_token: "mock-refresh" }));
    }

    // videos.list — statistics (analytics collection, #4)
    if (req.method === "GET" && url.includes("/youtube/v3/videos") && url.includes("part=statistics")) {
      const ids = new URL(url, "http://x").searchParams.get("id")?.split(",") ?? [];
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({
          items: ids.map((id) => ({ id, statistics: { viewCount: "15420", likeCount: "812", commentCount: "64" } })),
        }),
      );
    }

    // chart=mostPopular — trending tag research (#9)
    if (req.method === "GET" && url.includes("chart=mostPopular")) {
      res.writeHead(200, "application/json" === "x" ? {} : { "content-type": "application/json" });
      return res.end(
        JSON.stringify({
          items: [
            { snippet: { tags: ["Vrindavan", "Krishna", "Radha Rani", "Bhakti", "Darshan", "Viral Shorts"] } },
            { snippet: { tags: ["Vrindavan", "Hindu Devotional", "Trending Shorts", "Radha Rani"] } },
          ],
        }),
      );
    }

    // videos.list — location read-back check
    if (req.method === "GET" && url.includes("/youtube/v3/videos")) {
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({
          items: [
            {
              id: "MOCKYTiD12345",
              recordingDetails: locationStored
                ? { recordingDate: new Date().toISOString(), location: INDIA, locationDescription: "India" }
                : { recordingDate: new Date().toISOString() },
            },
          ],
        }),
      );
    }

    // videos.update (PUT) — repair path
    if (req.method === "PUT" && url.includes("/youtube/v3/videos")) {
      const text = body.toString("utf8");
      if (url.includes("localizations")) {
        console.log("LOCALIZATION SET", text.includes('"hi"') ? "hindi" : text.includes('"en"') ? "english" : "?");
        res.writeHead(200, { "content-type": "application/json" });
        return res.end(JSON.stringify({ id: "MOCKYTiD12345" }));
      }
      console.log("LOCATION UPDATE", text.includes('"location"') ? "accepted location field" : "no location");
      locationStored = true;
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(JSON.stringify({ id: "MOCKYTiD12345" }));
    }

    // search.list — forMine channel search used for the "already on channel" check.
    // In "hasit" mode the channel already contains the queried shortcode.
    if (req.method === "GET" && url.includes("/youtube/v3/search")) {
      const q = new URL(url, "http://x").searchParams.get("q") ?? "";
      const items =
        mode === "hasit"
          ? [{ id: { videoId: "EXISTING999" }, snippet: { title: "existing", description: `Source: https://www.instagram.com/reel/${q}/` } }]
          : [];
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(JSON.stringify({ items }));
    }

    if (url.includes("/upload/youtube/v3/videos")) {
      const text = body.toString("utf8");
      const jsonMatch = text.match(/\{[\s\S]*?\}(?=\r\n--)/) || text.match(/\{[\s\S]*\}/);
      let meta = {};
      try {
        meta = JSON.parse(jsonMatch ? jsonMatch[0] : "{}");
      } catch {}
      const sn = meta.snippet ?? {};
      const st = meta.status ?? {};
      const rd = meta.recordingDetails ?? {};
      const tags = Array.isArray(sn.tags) ? sn.tags : [];
      console.log(
        "VIDEO UPLOAD",
        JSON.stringify({
          title: sn.title,
          categoryId: sn.categoryId,
          language: sn.defaultLanguage,
          hasIndiaLocation: Boolean(rd.location && Math.abs(rd.location.latitude - 20.5937) < 0.01),
          viralTags: ["Viral", "Trending", "India", "Shorts"].every((t) =>
            tags.some((x) => String(x).toLowerCase() === t.toLowerCase()),
          ),
          descHasInstagram: /instagram\.com/.test(sn.description ?? ""),
          tagHasShortcode: tags.some((x) => /^[A-Za-z0-9_-]{8,}$/.test(String(x))),
          descHasDisclaimer: /rights belong to the original creators/.test(sn.description ?? ""),
          publishAt: Boolean(st.publishAt),
          publishDate: st.publishAt ?? null,
          private: st.privacyStatus === "private",
          publicStats: st.publicStatsViewable === true,
          mp4: text.includes("video/mp4"),
        }),
      );
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(JSON.stringify({ id: "MOCKYTiD12345" }));
    }

    if (req.method === "POST" && url.includes("/youtube/v3/playlists?")) {
      console.log("PLAYLIST CREATED");
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(JSON.stringify({ id: "PLMOCK123" }));
    }
    if (req.method === "POST" && url.includes("/playlistItems")) {
      console.log("PLAYLIST ITEM ADDED");
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(JSON.stringify({ id: "PLITEM1" }));
    }
    if (req.method === "POST" && url.includes("/youtube/v3/comments")) {
      console.log("CTA COMMENT POSTED");
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(JSON.stringify({ id: "CMT1" }));
    }

    if (url.includes("/thumbnails/set")) {
      console.log(`THUMBNAIL set bytes=${body.length}`);
      res.writeHead(200, { "content-type": "application/json" });
      return res.end("{}");
    }

    res.writeHead(404);
    res.end("{}");
  });
});

server.listen(port, () => console.log(`mock google ready on ${port} mode=${mode}`));
setTimeout(() => process.exit(0), 600000);
