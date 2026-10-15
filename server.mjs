// Zero-dependency static server + the /api/coach function, for local use and simple hosting.
//   npm start            -> http://localhost:3000
//   PORT=8080 npm start
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import coach from './api/coach.js';

const root = resolve(fileURLToPath(new URL('./public', import.meta.url)));
export const SECURITY_HEADERS = {
  'content-security-policy':
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
};
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > 200_000) throw new Error('too large');
    chunks.push(c);
  }
  return Buffer.concat(chunks).toString('utf8');
}

const server = createServer(async (req, res) => {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.setHeader(k, v);
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api/coach') {
      if (req.method === 'POST') {
        try {
          req.body = await readBody(req);
        } catch {
          res.statusCode = 413;
          return res.end('{"error":"too large"}');
        }
      }
      return coach(req, res);
    }

    let rel = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, '');
    if (!rel) rel = 'index.html';
    const file = join(root, rel);
    if (!file.startsWith(root + sep)) {
      res.statusCode = 403;
      return res.end('Forbidden');
    }
    try {
      const s = await stat(file);
      if (!s.isFile()) throw new Error('not a file');
    } catch {
      res.statusCode = 404;
      return res.end('Not found');
    }
    const data = await readFile(file);
    res.setHeader('content-type', types[extname(file)] || 'application/octet-stream');
    res.setHeader('cache-control', 'no-cache');
    res.end(data);
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('Server error');
  }
});

const port = Number(process.env.PORT) || 3000;
server.listen(port, () => {
  const ai = process.env.ANTHROPIC_API_KEY ? 'AI coach ON' : 'AI coach off (set ANTHROPIC_API_KEY to enable)';
  console.log(`Athlete Creator Blueprint running at http://localhost:${port}  [${ai}]`);
});
