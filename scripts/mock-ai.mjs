// Mock AI chat endpoint — returns a caption-specific "viral heading" JSON so
// the AI path and per-video title uniqueness can be verified without spending
// real API credits.
// Usage: node scripts/mock-ai.mjs [port]
import http from "node:http";

const port = Number(process.argv[2] ?? 4595);
const mode = process.argv[3] ?? "match"; // match | mismatch | fixed (identical titles → tests dedupe)

function verdictFromPrompt() {
  return mode === "mismatch"
    ? { verdict: "wrong_topic", confidence: 92, detected_topic: "banke-bihari-ji", reason: "Frames clearly show a different subject", evidence: ["x"] }
    : { verdict: "relevant", confidence: 90, reason: "Content matches the claimed subject", evidence: ["y"] };
}

function headingFromPrompt(prompt) {
  const m = prompt.match(/Video caption\/content:\s*"([\s\S]{0,300})/);
  const cap = (m?.[1] ?? "Vrindavan darshan").replace(/\s+/g, " ").trim();
  const words = cap.split(" ").slice(0, 8).join(" ");
  if (mode === "fixed") {
    // Deliberately returns the SAME title for every video — proves the
    // app-side dedupe produces unique headings anyway.
    return {
      title: "Vrindavan Darshan You Must Watch Today",
      hashtags: ["#Vrindavan", "#Krishna", "#Darshan"],
      description: "Watch till the end",
      category: "19",
      language: "en",
    };
  }
  return {
    title: `✨ ${words} — You MUST Watch This!`.slice(0, 95),
    hashtags: ["#Vrindavan", "#Krishna", "#Darshan", "#RadhaRani", "#HinduDevotional", "#India", "#Shorts"],
    description: `${words}\n\n#Vrindavan #Darshan\n\nWatch till the end 🙏\nLike, Share & Follow for daily Vrindavan darshan 🙏\n📍 Vrindavan, India`,
    category: "24",
    language: "en",
  };
}

const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    if ((req.url ?? "").includes("/chat/completions")) {
      let prompt = "";
      try {
        const c = JSON.parse(body)?.messages?.[0]?.content;
        prompt = typeof c === "string" ? c : Array.isArray(c) ? c.filter((p) => p?.type === "text").map((p) => p?.text ?? "").join("\n") : "";
      } catch {}
      const isReview = /TARGET TOPIC|quality-control|verdict/i.test(prompt);
      const payload = isReview ? verdictFromPrompt() : headingFromPrompt(prompt);
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({ choices: [{ message: { content: JSON.stringify(payload) } }] }),
      );
    }
    if ((req.url ?? "").includes(":generateContent")) {
      let prompt = "";
      try {
        prompt = JSON.parse(body)?.contents?.[0]?.parts?.[0]?.text ?? "";
      } catch {}
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({
          candidates: [{ content: { parts: [{ text: JSON.stringify(headingFromPrompt(prompt)) }] } }],
        }),
      );
    }
    res.writeHead(404);
    res.end("{}");
  });
});
server.listen(port, () => console.log(`mock AI ready on ${port}`));
setTimeout(() => process.exit(0), 300000);
