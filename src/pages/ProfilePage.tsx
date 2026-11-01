import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { levels } from '../content';
import { badges } from '../content/badges';
import { certs } from '../content/certs';
import type { CertId } from '../types/content';
import { DEFAULT_DAILY_GOAL, emptyProgress, isPassed, levelProgress, parseImport, playerLevel, reviewKey } from '../lib/progress';
import { useProgress } from '../lib/ProgressContext';
import { readTheme, setTheme, type ThemePref } from '../lib/theme';

export function ProfilePage() {
  const { progress, replace } = useProgress();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const pl = playerLevel(progress.xp);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `netcloud-fortschritt-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = async (file: File) => {
    try {
      const p = parseImport(await file.text());
      if (!confirm('Aktuellen Fortschritt durch die Datei ersetzen?')) return;
      replace(p);
      setMsg('✅ Fortschritt importiert.');
    } catch (e) {
      setMsg(`❌ Import fehlgeschlagen: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight">Profil</h1>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
          <Stat label="Spielerlevel" value={pl.level} />
          <Stat label="XP" value={progress.xp} />
          <Stat label="Streak (Rekord)" value={`${progress.streak.current} (${progress.streak.longest})`} />
          <Stat label="Antworten" value={progress.answered} />
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">🎓 Zertifikats-Fortschritt</h2>
        <p className="mb-3 text-xs text-slate-400">Bestandene Level, die Themen der jeweiligen Prüfung abdecken (bezogen auf bisher verfügbare Level).</p>
        <div className="space-y-2">
          {(Object.keys(certs) as CertId[]).map((c) => {
            const rel = levels.filter((l) => l.certs.includes(c));
            const done = rel.filter((l) => isPassed(levelProgress(progress, l.id))).length;
            return (
              <div key={c} className="rounded-xl bg-slate-900 p-3">
                <div className="flex justify-between text-sm">
                  <span>{certs[c].name} <span className="text-slate-500">({certs[c].exam})</span></span>
                  <span className="text-slate-400">{done}/{rel.length}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full bg-emerald-400" style={{ width: rel.length ? `${(done / rel.length) * 100}%` : '0' }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Settings />
      <ErrorStats />

      <section>
        <h2 className="mb-2 text-lg font-bold">🏅 Abzeichen</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {badges.map((b) => {
            const got = progress.badges[b.id];
            return (
              <div key={b.id} className={`rounded-xl border p-3 ${got ? 'border-yellow-400/40 bg-yellow-400/5' : 'border-slate-800 opacity-40 grayscale'}`}>
                <div className="text-2xl">{b.icon}</div>
                <div className="text-sm font-semibold">{b.name}</div>
                <div className="text-xs text-slate-400">{b.description}</div>
                {got && <div className="mt-1 text-[10px] text-yellow-300">{got}</div>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">💾 Daten</h2>
        <p className="text-sm text-slate-400">Der Fortschritt liegt nur in diesem Browser. Exportiere ihn als Backup oder für ein anderes Gerät.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={exportJson} className="rounded-full bg-slate-800 px-5 py-2 hover:bg-slate-700">⬇️ Export (JSON)</button>
          <button type="button" onClick={() => fileRef.current?.click()} className="rounded-full bg-slate-800 px-5 py-2 hover:bg-slate-700">⬆️ Import</button>
          <button
            type="button"
            onClick={() => confirm('Gesamten Fortschritt unwiderruflich löschen?') && replace(emptyProgress())}
            className="rounded-xl bg-rose-900/50 px-4 py-2 text-rose-200 hover:bg-rose-900"
          >
            Zurücksetzen
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importJson(f);
            e.target.value = '';
          }}
        />
        {msg && <p className="text-sm">{msg}</p>}
      </section>
    </div>
  );
}

function Settings() {
  const { progress, update } = useProgress();
  const s = progress.settings;
  const setSetting = (patch: Partial<typeof s>) => update((p) => ({ ...p, settings: { ...p.settings, ...patch } }));
  const toggleReminder = async () => {
    if (s.reminder) return setSetting({ reminder: false });
    if (typeof Notification === 'undefined') return alert('Dieser Browser unterstützt keine Benachrichtigungen.');
    const perm = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
    if (perm === 'granted') setSetting({ reminder: true });
  };
  const [theme, setThemeState] = useState(readTheme);
  const themes: [ThemePref, string][] = [['system', 'System'], ['light', 'Hell'], ['dark', 'Dunkel']];
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold">⚙️ Einstellungen</h2>
      <div className="text-sm">
        <span className="mb-1 block text-slate-300">Darstellung (gilt nur auf diesem Gerät)</span>
        <div role="radiogroup" aria-label="Darstellung" className="grid grid-cols-3 gap-1 rounded-xl bg-slate-800 p-1">
          {themes.map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={theme === id}
              onClick={() => { setTheme(id); setThemeState(id); }}
              className={`rounded-lg py-1.5 font-medium transition ${theme === id ? 'bg-cyan-500 text-snow' : 'text-slate-300 hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block text-slate-300">Zertifikats-Fokus (blendet Detailfragen anderer Zertifikate aus, z. B. AZ-104-Tiefe im AZ-900-Modus)</span>
        <select
          value={s.focusCert ?? ''}
          onChange={(e) => setSetting({ focusCert: (e.target.value || undefined) as CertId | undefined })}
          className="w-full rounded-lg border-2 border-slate-700 bg-slate-900 px-3 py-2"
        >
          <option value="">Kein Fokus – alle Fragen</option>
          {(Object.keys(certs) as CertId[]).map((c) => <option key={c} value={c}>{certs[c].name} ({certs[c].exam})</option>)}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-slate-300">Tagesziel (Ring oben in der Leiste)</span>
        <select
          value={s.dailyGoal ?? DEFAULT_DAILY_GOAL}
          onChange={(e) => setSetting({ dailyGoal: Number(e.target.value) })}
          className="w-full rounded-lg border-2 border-slate-700 bg-slate-900 px-3 py-2"
        >
          {[10, 30, 50, 100, 200].map((g) => <option key={g} value={g}>{g} XP pro Tag</option>)}
        </select>
      </label>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" className="h-4 w-4 accent-cyan-400" checked={!!s.reminder} onChange={toggleReminder} />
        <span>Streak-Erinnerung ab 18 Uhr, wenn heute noch nichts gelernt wurde (nur solange die App geöffnet ist)</span>
      </label>
      {Object.keys(progress.exams).length > 0 && (
        <div className="text-sm text-slate-300">
          🎓 Prüfungssimulationen:{' '}
          {(Object.keys(progress.exams) as CertId[]).map((c) => `${certs[c].exam} best ${Math.round(progress.exams[c]!.best * 100)} %`).join(' · ')}
        </div>
      )}
    </section>
  );
}

function ErrorStats() {
  const { progress } = useProgress();
  const perLevel = levels
    .map((l) => {
      const qs = [...l.quiz, ...l.boss.questions];
      const errors = qs.reduce((n, q) => n + (progress.wrongTotal[reviewKey(l.id, q.id)] ?? 0), 0);
      return { l, errors };
    })
    .filter((x) => x.errors > 0)
    .sort((a, b) => b.errors - a.errors);
  const perType: Record<string, number> = {};
  levels.forEach((l) =>
    [...l.quiz, ...l.boss.questions].forEach((q) => {
      const n = progress.wrongTotal[reviewKey(l.id, q.id)] ?? 0;
      if (n) perType[q.type] = (perType[q.type] ?? 0) + n;
    }),
  );
  if (!perLevel.length) return null;
  const max = perLevel[0].errors;
  return (
    <section>
      <h2 className="mb-2 text-lg font-bold">📉 Fehlerstatistik</h2>
      <p className="mb-2 text-sm text-slate-300">
        Empfehlung: <Link to={`/level/${perLevel[0].l.id}`} className="text-cyan-400 underline">„{perLevel[0].l.title}“ wiederholen</Link> – dort passieren dir die meisten Fehler.
      </p>
      <div className="space-y-1">
        {perLevel.slice(0, 6).map(({ l, errors }) => (
          <div key={l.id} className="flex items-center gap-2 text-sm">
            <span className="w-40 truncate">{l.title}</span>
            <div className="h-2 flex-1 overflow-hidden rounded bg-slate-800"><div className="h-full bg-rose-400" style={{ width: `${(errors / max) * 100}%` }} /></div>
            <span className="w-8 text-right text-slate-400">{errors}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Nach Fragetyp: {Object.entries(perType).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t} ${n}`).join(' · ')}
      </p>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-slate-900 p-3">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
