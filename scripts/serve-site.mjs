// Serve the built site over HTTP for the accessibility audit, in CI and
// locally. Built-ins only, no dependency: the deploy workflow runs inside
// Playwright's container image, which has Node but no Python.
//
//   npm run build && npm run serve   # then npm run a11y in another shell
//
// Usage: node scripts/serve-site.mjs [dir] [port]   (defaults: _site, 8080)
// Resolves /path/ to /path/index.html like GitHub Pages. Binds 127.0.0.1.
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(process.argv[2] || '_site');
const port = Number(process.argv[3] || 8080);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.webmanifest': 'application/manifest+json'
};

function fileFor(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  let file = join(root, clean);
  if (!file.startsWith(root)) return null;
  try {
    if (statSync(file).isDirectory()) file = join(file, 'index.html');
    if (statSync(file).isFile()) return file;
  } catch {
    // fall through: try the .html twin, then 404
  }
  try {
    const twin = `${file}.html`;
    if (statSync(twin).isFile()) return twin;
  } catch {
    // 404 below
  }
  return null;
}

createServer((req, res) => {
  const file = fileFor(req.url || '/');
  if (!file) {
    const notFound = fileFor('/404.html');
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    if (notFound) createReadStream(notFound).pipe(res);
    else res.end('Not found');
    return;
  }
  res.writeHead(200, { 'content-type': types[extname(file).toLowerCase()] || 'application/octet-stream' });
  createReadStream(file).pipe(res);
}).listen(port, '127.0.0.1', () => {
  console.log(`Serving ${root} at http://127.0.0.1:${port}/`);
});
