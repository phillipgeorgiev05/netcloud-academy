import { useMemo, useState, type ReactNode } from 'react';
import { chmodOf, GPO_ORDER, lsdouWinner, type GpoLevel, type GpoLink } from '../lib/games';
import { shuffle } from './questions/shared';

function GameFrame({ title, score, children }: { title: string; score?: number; children: ReactNode }) {
  return (
    <figure className="mt-4 rounded-2xl bg-slate-950 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-violet-500">Mini-Spiel · {title}</span>
        {score !== undefined && <span className="text-xs font-semibold text-slate-400">{score} gelöst</span>}
      </div>
      {children}
    </figure>
  );
}

const okBox = 'anim-pop mt-3 rounded-xl bg-emerald-500/15 p-3 text-sm font-medium text-emerald-300';
const nextBtn = 'mt-2 rounded-full bg-slate-800 px-4 py-1.5 text-sm font-semibold hover:bg-slate-700';

/** Binär: Bits antippen, bis die Zielzahl erreicht ist. */
const WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];
const randByte = (not?: number) => {
  let n;
  do n = 1 + Math.floor(Math.random() * 255);
  while (n === not);
  return n;
};

export function BinaryGame() {
  const [bits, setBits] = useState<boolean[]>(Array(8).fill(false));
  const [target, setTarget] = useState(() => randByte());
  const [score, setScore] = useState(0);
  const value = bits.reduce((s, b, i) => s + (b ? WEIGHTS[i] : 0), 0);
  const ok = value === target;
  const toggle = (i: number) => {
    if (ok) return;
    const next = bits.map((b, j) => (j === i ? !b : b));
    setBits(next);
    if (next.reduce((s, b, j) => s + (b ? WEIGHTS[j] : 0), 0) === target) setScore(score + 1);
  };
  return (
    <GameFrame title="Binär-Schalter" score={score}>
      <p className="text-sm text-slate-300">Schalte die Bits so, dass <strong className="text-white">{target}</strong> herauskommt.</p>
      <div className="mt-3 grid grid-cols-8 gap-1">
        {bits.map((b, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            aria-pressed={b}
            aria-label={`Bit mit Wert ${WEIGHTS[i]}`}
            className={`flex flex-col items-center rounded-lg py-2 ${b ? 'bg-cyan-500 text-snow' : 'bg-slate-800 text-slate-400'}`}
          >
            <span className="mono text-lg font-bold">{b ? 1 : 0}</span>
            <span className="text-[10px]">{WEIGHTS[i]}</span>
          </button>
        ))}
      </div>
      <div className="mt-2 text-sm text-slate-400">
        Aktuell: <span className="font-semibold text-white">{value}</span> · Hex <span className="mono">{value.toString(16).toUpperCase().padStart(2, '0')}</span>
      </div>
      {ok && (
        <div className={okBox}>
          Richtig! {target} = <span className="mono">{bits.map(Number).join('')}</span>
          <div><button type="button" className={nextBtn} onClick={() => { setTarget(randByte(target)); setBits(Array(8).fill(false)); }}>Neue Zahl</button></div>
        </div>
      )}
    </GameFrame>
  );
}

/** Kapselung: Header in der richtigen Reihenfolge anlegen und beim Empfänger wieder entfernen. */
const HEADERS = [
  { id: 'tcp', label: 'TCP-Header', info: 'Port 51000 → 443', layer: 4, box: 'border-amber-400', text: 'text-amber-300' },
  { id: 'ip', label: 'IP-Header', info: '192.168.1.20 → 93.184.215.14', layer: 3, box: 'border-emerald-400', text: 'text-emerald-300' },
  { id: 'eth', label: 'Ethernet-Header + FCS', info: 'MAC PC → MAC Router', layer: 2, box: 'border-sky-400', text: 'text-sky-300' },
];

export function EncapsulationGame() {
  const [wrapped, setWrapped] = useState<string[]>([]);
  const [phase, setPhase] = useState<'pack' | 'unpack' | 'done'>('pack');
  const [msg, setMsg] = useState('');
  const buttons = useMemo(() => shuffle(HEADERS), []);

  const pick = (id: string) => {
    if (phase === 'pack') {
      const want = HEADERS[wrapped.length];
      if (id !== want.id) return setMsg(`Noch nicht: Beim Senden geht es von oben nach unten. Als Nächstes kommt Schicht ${want.layer}.`);
      setMsg('');
      setWrapped([...wrapped, id]);
    } else if (phase === 'unpack') {
      const want = wrapped[wrapped.length - 1];
      if (id !== want) return setMsg('Beim Empfangen wird von außen nach innen ausgepackt: zuerst die äußerste Hülle.');
      setMsg('');
      const rest = wrapped.slice(0, -1);
      setWrapped(rest);
      if (rest.length === 0) setPhase('done');
    }
  };

  let inner: ReactNode = <span className="inline-block rounded-md bg-violet-500 px-2 py-1 text-xs font-semibold text-snow">Daten · GET /index.html</span>;
  for (const id of wrapped) {
    const h = HEADERS.find((x) => x.id === id)!;
    inner = (
      <div key={id} className={`anim-pop rounded-xl border-2 ${h.box} p-1.5`}>
        <div className={`mb-1 px-1 text-[11px] font-semibold ${h.text}`}>{h.label} · {h.info}</div>
        {inner}
      </div>
    );
  }

  return (
    <GameFrame title="Pack das Paket">
      <p className="text-sm text-slate-300">
        {phase === 'pack' && 'Du sendest eine Webanfrage. Tippe die Header in der Reihenfolge an, in der sie beim Senden dazukommen.'}
        {phase === 'unpack' && 'Der Rahmen ist beim Empfänger angekommen. Pack ihn wieder aus.'}
        {phase === 'done' && 'Die Daten sind beim Webserver angekommen.'}
      </p>
      <div className="mt-3 flex min-h-24 items-center justify-center rounded-xl bg-slate-900 p-2 text-center">{inner}</div>
      {phase !== 'done' && !(phase === 'pack' && wrapped.length === 3) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {buttons.map((h) => (
            <button
              key={h.id}
              type="button"
              disabled={phase === 'pack' ? wrapped.includes(h.id) : !wrapped.includes(h.id)}
              onClick={() => pick(h.id)}
              className="rounded-full bg-slate-800 px-3 py-1.5 text-sm font-medium hover:bg-slate-700 disabled:opacity-30"
            >
              {h.label}
            </button>
          ))}
        </div>
      )}
      {msg && <p className="mt-2 text-sm text-rose-300" aria-live="polite">{msg}</p>}
      {phase === 'pack' && wrapped.length === 3 && (
        <div className={okBox}>
          Fertiger Rahmen! Schicht 1 schickt ihn jetzt als Bits über das Kabel.
          <div><button type="button" className={nextBtn} onClick={() => setPhase('unpack')}>Beim Empfänger auspacken</button></div>
        </div>
      )}
      {phase === 'done' && (
        <div className={okBox}>
          Geschafft: Senden = Header anlegen (4 → 3 → 2), Empfangen = Header entfernen (2 → 3 → 4).
          <div><button type="button" className={nextBtn} onClick={() => { setWrapped([]); setPhase('pack'); }}>Nochmal</button></div>
        </div>
      )}
    </GameFrame>
  );
}

/** chmod: Rechte-Schalter so setzen, dass die Zielzahl entsteht. */
const CHMOD_TARGETS = ['755', '644', '700', '600', '750', '640', '775', '664', '711', '444'];
const WHO = ['Besitzer (u)', 'Gruppe (g)', 'Andere (o)'];

export function ChmodGame() {
  const [bits, setBits] = useState<boolean[]>(Array(9).fill(false));
  const [target, setTarget] = useState(() => CHMOD_TARGETS[Math.floor(Math.random() * CHMOD_TARGETS.length)]);
  const [score, setScore] = useState(0);
  const { octal, symbolic } = chmodOf(bits);
  const ok = octal === target;
  const toggle = (i: number) => {
    if (ok) return;
    const next = bits.map((b, j) => (j === i ? !b : b));
    setBits(next);
    if (chmodOf(next).octal === target) setScore(score + 1);
  };
  const newTarget = () => {
    const rest = CHMOD_TARGETS.filter((t) => t !== target);
    setTarget(rest[Math.floor(Math.random() * rest.length)]);
    setBits(Array(9).fill(false));
  };
  return (
    <GameFrame title="Rechte-Rechner" score={score}>
      <p className="text-sm text-slate-300">Setze die Rechte für <code className="rounded bg-slate-800 px-1">chmod {target} bericht.txt</code>.</p>
      <div className="mt-3 space-y-1.5">
        {WHO.map((w, who) => (
          <div key={w} className="flex items-center gap-2">
            <span className="w-24 shrink-0 text-xs text-slate-400">{w}</span>
            {['r', 'w', 'x'].map((p, k) => {
              const i = who * 3 + k;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggle(i)}
                  aria-pressed={bits[i]}
                  aria-label={`${w}: ${p}`}
                  className={`mono flex-1 rounded-lg py-1.5 text-sm font-bold ${bits[i] ? 'bg-emerald-500 text-snow' : 'bg-slate-800 text-slate-500'}`}
                >
                  {p} <span className="text-[10px] font-normal opacity-70">{[4, 2, 1][k]}</span>
                </button>
              );
            })}
            <span className="mono w-5 text-center font-bold">{octal[who]}</span>
          </div>
        ))}
      </div>
      <div className="mono mt-2 text-sm text-slate-400">ls -l: <span className="text-white">-{symbolic}</span> · Oktal {octal}</div>
      {ok && (
        <div className={okBox}>
          Richtig! {target} = {symbolic}
          <div><button type="button" className={nextBtn} onClick={newTarget}>Nächste Aufgabe</button></div>
        </div>
      )}
    </GameFrame>
  );
}

/** LSDOU: Welche Einstellung gewinnt? Zufällige Szenarien mit „Erzwungen“. */
const GPO_NAMES: Record<GpoLevel, string> = { L: 'Lokal', S: 'Standort (Site)', D: 'Domäne', OU: 'OU' };
const COLORS = ['Blau', 'Rot', 'Grün', 'Gelb'];

function randomScenario(): Record<GpoLevel, GpoLink> {
  for (;;) {
    const s = Object.fromEntries(
      GPO_ORDER.map((l) => [l, { value: Math.random() < 0.65 ? COLORS[Math.floor(Math.random() * COLORS.length)] : null }]),
    ) as Record<GpoLevel, GpoLink>;
    const configured = GPO_ORDER.filter((l) => s[l].value !== null);
    if (new Set(configured.map((l) => s[l].value)).size < 2) continue;
    // Manchmal ist eine Domänen- oder Standort-GPO erzwungen
    const candidates = configured.filter((l) => l === 'S' || l === 'D');
    if (candidates.length && Math.random() < 0.4) s[candidates[Math.floor(Math.random() * candidates.length)]].enforced = true;
    return s;
  }
}

export function LsdouGame() {
  const [s, setS] = useState(randomScenario);
  const [pick, setPick] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const win = lsdouWinner(s);
  const options = [...new Set(GPO_ORDER.map((l) => s[l].value).filter((v): v is string => v !== null))];
  const choose = (v: string) => {
    if (pick) return;
    setPick(v);
    if (v === win.value) setScore(score + 1);
  };
  return (
    <GameFrame title="Wer gewinnt?" score={score}>
      <p className="text-sm text-slate-300">Mehrere GPOs setzen den Desktop-Hintergrund. Welcher gilt am Ende?</p>
      <ol className="mt-3 space-y-1">
        {GPO_ORDER.map((l, i) => (
          <li key={l} className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${pick && win.from === l ? 'bg-emerald-500/15' : 'bg-slate-900'}`}>
            <span className="w-5 text-xs text-slate-500">{i + 1}.</span>
            <span className="flex-1">{GPO_NAMES[l]}</span>
            {s[l].enforced && <span className="rounded-full bg-rose-500 px-2 text-[11px] font-semibold text-snow">erzwungen</span>}
            <span className={s[l].value ? 'font-semibold' : 'text-slate-500'}>{s[l].value ?? 'nicht konfiguriert'}</span>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => choose(v)}
            disabled={!!pick && v !== pick && v !== win.value}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              pick && v === win.value ? 'bg-emerald-500 text-snow' : pick === v ? 'bg-rose-500 text-snow' : 'bg-slate-800 hover:bg-slate-700'
            } disabled:opacity-30`}
          >
            {v}
          </button>
        ))}
      </div>
      {pick && (
        <div className={`anim-pop mt-3 rounded-xl p-3 text-sm ${pick === win.value ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
          {pick === win.value ? 'Richtig! ' : 'Leider nicht. '}
          Es gilt <strong>{win.value}</strong> aus „{GPO_NAMES[win.from!]}“:{' '}
          {s[win.from!].enforced
            ? 'Eine erzwungene GPO kann von tieferen Ebenen nicht überschrieben werden.'
            : 'Verarbeitet wird L → S → D → OU, die zuletzt angewendete konfigurierte Einstellung gewinnt.'}
          <div><button type="button" className={nextBtn} onClick={() => { setS(randomScenario()); setPick(null); }}>Neues Szenario</button></div>
        </div>
      )}
    </GameFrame>
  );
}
