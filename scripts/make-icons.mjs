// Erzeugt die PWA-Icons (PNG) ohne Zusatzpakete: `node scripts/make-icons.mjs`.
// Motiv: drei verbundene Netzwerkknoten auf dunklem Grund.
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const BG = [0, 0, 0];
const FG = [10, 132, 255];

function crc32(buf) {
  let c = ~0;
  for (const b of buf) {
    c ^= b;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

function distToSegment(px, py, [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function icon(size, padding) {
  // Knoten in Einheitskoordinaten, bei maskable mit Sicherheitsrand
  const s = (v) => padding + v * (1 - 2 * padding);
  const nodes = [[0.5, 0.25], [0.25, 0.72], [0.75, 0.72]].map(([x, y]) => [s(x) * size, s(y) * size]);
  const r = 0.11 * (1 - 2 * padding) * size;
  const line = 0.035 * (1 - 2 * padding) * size;
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = [0];
    for (let x = 0; x < size; x++) {
      const onNode = nodes.some(([nx, ny]) => Math.hypot(x - nx, y - ny) <= r);
      const onLine = [[0, 1], [1, 2], [2, 0]].some(([a, b]) => distToSegment(x, y, nodes[a], nodes[b]) <= line);
      row.push(...(onNode || onLine ? FG : BG), 255);
    }
    rows.push(Buffer.from(row));
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // Bit-Tiefe
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync('public', { recursive: true });
writeFileSync('public/icon-192.png', icon(192, 0.08));
writeFileSync('public/icon-512.png', icon(512, 0.08));
writeFileSync('public/icon-maskable-512.png', icon(512, 0.2));
writeFileSync('public/apple-touch-icon.png', icon(180, 0.08));
console.log('Icons geschrieben.');
