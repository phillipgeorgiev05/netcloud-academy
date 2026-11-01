import type { Question } from '../../types/content';
import { ChainQuestionView } from './ChainQuestionView';
import { ChoiceQuestion } from './ChoiceQuestion';
import { ConfigQuestionView } from './ConfigQuestionView';
import { GeneratedQuestionView } from './GeneratedQuestionView';
import { OrderingQuestionView } from './OrderingQuestionView';
import { CliQuestionView } from './CliQuestionView';
import { DragDropQuestionView } from './DragDropQuestionView';
import { SubnetQuestionView } from './SubnetQuestionView';
import { TopologyQuestionView } from './TopologyQuestionView';
import { RichText, type Result } from './shared';

const typeLabels: Record<Question['type'], string> = {
  single: 'Multiple Choice',
  multi: 'Mehrfachauswahl',
  scenario: 'Szenario',
  dragdrop: 'Zuordnen',
  ordering: 'Reihenfolge',
  subnet: 'Subnetting',
  generated: 'Rechenaufgabe',
  cli: 'CLI-Befehl',
  topology: 'Topologie',
  chain: 'Fehlersuche',
  config: 'Baukasten',
};

/** Zeigt eine Frage beliebigen Typs. Neue Fragetypen: hier und in types/content.ts ergänzen. */
export function QuestionRenderer({ q, result, onResult }: { q: Question; result: Result | null; onResult: (r: Result) => void }) {
  const locked = result !== null;
  const props = { onResult, locked };
  return (
    <div>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-cyan-400">
        {typeLabels[q.type]} · {'★'.repeat(q.difficulty)}
      </div>
      {q.prompt && <RichText text={q.prompt} className="mb-4 text-lg font-medium text-white" />}
      {(() => {
        switch (q.type) {
          case 'single':
          case 'scenario':
          case 'multi':
            return <ChoiceQuestion q={q} {...props} />;
          case 'dragdrop':
            return <DragDropQuestionView q={q} {...props} />;
          case 'ordering':
            return <OrderingQuestionView q={q} {...props} />;
          case 'subnet':
            return <SubnetQuestionView q={q} {...props} />;
          case 'generated':
            return <GeneratedQuestionView q={q} {...props} />;
          case 'chain':
            return <ChainQuestionView q={q} {...props} />;
          case 'config':
            return <ConfigQuestionView q={q} {...props} />;
          case 'cli':
            return <CliQuestionView q={q} {...props} />;
          case 'topology':
            return <TopologyQuestionView q={q} {...props} />;
        }
      })()}
      {result && <Feedback q={q} r={result} />}
    </div>
  );
}

function Feedback({ q, r }: { q: Question; r: Result }) {
  const explanation = r.explanation ?? q.explanation;
  return (
    <div
      role="status"
      className={`mt-5 space-y-3 rounded-xl border-2 p-4 ${r.correct ? 'border-emerald-500/60 bg-emerald-500/10' : 'border-rose-500/60 bg-rose-500/10'}`}
    >
      <div className="text-lg font-bold">{r.correct ? '✅ Richtig!' : '❌ Leider falsch'}</div>
      {!r.correct && (
        <>
          <div>
            <div className="text-sm font-semibold text-emerald-300">Richtige Antwort</div>
            <div className="font-mono text-sm break-words">{r.solution}</div>
          </div>
          {r.whyWrong.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-rose-300">Warum deine Antwort nicht passt</div>
              <ul className="list-disc pl-5 text-sm">
                {r.whyWrong.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}
        </>
      )}
      {explanation && (
        <div>
          <div className="text-sm font-semibold text-cyan-300">Erklärung</div>
          <RichText text={explanation} className="text-sm" />
        </div>
      )}
      {q.type === 'cli' && q.portal && (
        <div className="rounded-lg bg-sky-400/10 p-3 text-sm">
          <span className="font-semibold text-sky-300">🖱️ Im Portal: </span>
          {q.portal}
        </div>
      )}
      {q.analogy && (
        <div className="rounded-lg bg-amber-400/10 p-3 text-sm">
          <span className="font-semibold text-amber-300">💡 Alltagsanalogie: </span>
          {q.analogy}
        </div>
      )}
    </div>
  );
}
