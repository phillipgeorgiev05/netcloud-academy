// Erzeugt die PWA-Icons (PNG) ohne Zusatzpakete: `node scripts/make-icons.mjs`.
// Motiv wie src/components/Icons.tsx (Logo): weiße Wolke mit drei verbundenen Netzwerkknoten auf blauem Verlauf.
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const TOP = [62, 166, 255];
const BOTTOM = [61, 59, 243];
const WHITE = [255, 255, 255];
const NODE = [42, 108, 255];
const SS = 4; // Unterabtastung pro Achse für glatte Kanten

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

// Logo-Koordinaten 0–64 wie im SVG
const cloud = [[22.5, 36, 9], [32.5, 29, 12], [42.5, 37, 8]];
const nodes = [[25, 38.5], [32.5, 30.5], [40, 38.5]];
const inCloud = (x, y) => cloud.some(([cx, cy, r]) => Math.hypot(x - cx, y - cy) <= r) || (x >= 22.5 && x <= 42.5 && y >= 36 && y <= 45);
const onNet = (x, y) =>
  nodes.some(([nx, ny]) => Math.hypot(x - nx, y - ny) <= 2.6) || [[0, 1], [1, 2], [2, 0]].some(([a, b]) => distToSegment(x, y, nodes[a], nodes[b]) <= 1);

/** Abstand-Test für ein abgerundetes Quadrat 0–64 mit Radius r. */
function inRounded(x, y, r) {
  const qx = Math.max(Math.abs(x - 32) - (32 - r), 0);
  const qy = Math.max(Math.abs(y - 32) - (32 - r), 0);
  return Math.hypot(qx, qy) <= r;
}

/** rounded: transparente Ecken (Android/Desktop). Sonst randlos (iOS maskiert selbst, maskable). glyph: Skalierung der Wolke. */
function icon(size, { rounded, glyph = 1 }) {
  const rows = [];
  for (let py = 0; py < size; py++) {
    const row = [0];
    for (let px = 0; px < size; px++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = ((px + (sx + 0.5) / SS) / size) * 64;
          const y = ((py + (sy + 0.5) / SS) / size) * 64;
          if (rounded && !inRounded(x, y, 14.5)) continue;
          const gx = 32 + (x - 32) / glyph;
          const gy = 32 + (y - 32) / glyph;
          const t = (x + y) / 128;
          const c = inCloud(gx, gy) ? (onNet(gx, gy) ? NODE : WHITE) : TOP.map((v, i) => v + (BOTTOM[i] - v) * t);
          r += c[0]; g += c[1]; b += c[2]; a += 255;
        }
      }
      const n = SS * SS;
      const cov = a / 255;
      row.push(...(cov ? [r / cov, g / cov, b / cov].map(Math.round) : [0, 0, 0]), Math.round(a / n));
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
writeFileSync('public/icon-192.png', icon(192, { rounded: true }));
writeFileSync('public/icon-512.png', icon(512, { rounded: true }));
writeFileSync('public/icon-maskable-512.png', icon(512, { rounded: false, glyph: 0.8 }));
writeFileSync('public/apple-touch-icon.png', icon(180, { rounded: false }));
console.log('Icons geschrieben.');
