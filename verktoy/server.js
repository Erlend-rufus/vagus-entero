#!/usr/bin/env node
// Liten statisk server med gzip for CI-måling: LHCI/axe måler dermed
// reell overført (komprimert) størrelse, slik ytelsesbudsjettet krever.
// Bruk: node verktoy/server.js [katalog] [port]

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const katalog = process.argv[2] || 'dist';
const port = Number(process.argv[3] || 8877);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg'
};

const KOMPRIMERBART = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.svg']);

http
  .createServer((req, res) => {
    const sti = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let fil = path.join(katalog, sti);
    if (sti.endsWith('/')) fil = path.join(fil, 'index.html');
    if (!fs.existsSync(fil) && fs.existsSync(`${fil}/index.html`)) fil = `${fil}/index.html`;

    if (!fs.existsSync(fil) || fs.statSync(fil).isDirectory()) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('404');
      return;
    }

    const endelse = path.extname(fil);
    const type = MIME[endelse] || 'application/octet-stream';
    const innhold = fs.readFileSync(fil);
    const vilKomprimere =
      KOMPRIMERBART.has(endelse) && /\bgzip\b/.test(req.headers['accept-encoding'] || '');

    if (vilKomprimere) {
      res.writeHead(200, { 'content-type': type, 'content-encoding': 'gzip' });
      res.end(zlib.gzipSync(innhold));
    } else {
      res.writeHead(200, { 'content-type': type });
      res.end(innhold);
    }
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`Serverer ${katalog} på http://localhost:${port}`);
  });
