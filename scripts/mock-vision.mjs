// Local mock vision provider for sanity-testing the AI topic gate.
// Usage: node scripts/mock-vision.mjs <port> <match|mismatch|429-once> [topicSlug]
import http from 'node:http';

const port = Number(process.argv[2] ?? 4598);
const mode = process.argv[3] ?? 'match';
const topic = process.argv[4] ?? 'premanand-ji-maharaj';
let rateLimitedOnce = false;

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    if (mode === '429-once' && !rateLimitedOnce) {
      rateLimitedOnce = true;
      res.writeHead(429, { 'content-type': 'application/json' });
      return res.end('{"error":"rate_limit_exceeded"}');
    }
    if ((req.url ?? '').includes('/chat/completions')) {
      const verdict =
        mode === 'mismatch'
          ? {
              verdict: 'mismatch',
              confidence: 91,
              detected_topic: 'banke-bihari-ji',
              reason: 'Frames show Banke Bihari temple, not the requested saint',
              evidence: ['temple sanctum', 'no saint visible'],
            }
          : {
              verdict: 'match',
              confidence: 93,
              detected_topic: topic,
              reason: 'Exact subject clearly visible in sampled frames',
              evidence: ['subject visible', 'correct setting'],
            };
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ choices: [{ message: { content: JSON.stringify(verdict) } }] }));
    }
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end('{"data":[]}');
  });
});

server.listen(port, () => console.log(`mock vision provider :${port} mode=${mode}`));
setTimeout(() => {
  server.close();
  process.exit(0);
}, 600000);
