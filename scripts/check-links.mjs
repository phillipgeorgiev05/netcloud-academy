// Prüft alle Quellen-Links (`url: 'https://…'`) in src/content: `npm run check:links`.
// Beispiel-URLs im Lehrtext (z. B. Phishing-Adressen) sind absichtlich erfunden und werden nicht geprüft.
// Exit-Code 1, wenn ein Link nicht erreichbar ist (4xx/5xx/Netzwerkfehler).
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : e.name.endsWith('.ts') && !e.name.endsWith('.test.ts') ? [join(dir, e.name)] : [],
  );
}

const urls = new Map(); // url -> erste Fundstelle
for (const f of files('src/content')) {
  // Platzhalter wie https://<name>.blob… sind keine echten Links.
  for (const m of readFileSync(f, 'utf8').matchAll(/url: '(https:\/\/[^']+)'/g)) if (!m[1].includes('<') && !urls.has(m[1])) urls.set(m[1], f);
}

async function check(url) {
  // Manche Server lehnen HEAD ab, dann GET versuchen.
  for (const method of ['HEAD', 'GET']) {
    try {
      const res = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(15_000), headers: { 'user-agent': 'Mozilla/5.0 netcloud-link-check' } });
      if (res.ok) return { ok: true, status: res.status };
      if (method === 'GET') return { ok: false, status: res.status };
    } catch (e) {
      if (method === 'GET') return { ok: false, status: e.cause?.code ?? e.name };
    }
  }
}

const results = await Promise.all([...urls].map(async ([url, file]) => ({ url, file, ...(await check(url)) })));
const bad = results.filter((r) => !r.ok);
for (const r of bad) console.log(`✗ ${r.status}  ${r.url}  (${r.file})`);
console.log(`${results.length - bad.length}/${results.length} Links erreichbar.`);
process.exit(bad.length ? 1 : 0);
