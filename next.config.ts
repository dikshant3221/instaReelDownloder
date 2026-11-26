import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite ships real PostgreSQL as WebAssembly + native FS data dir —
  // it must be loaded from node_modules at runtime, never bundled.
  serverExternalPackages: ["@electric-sql/pglite", "youtube-dl-exec", "ffmpeg-static"],
};

export default nextConfig;
