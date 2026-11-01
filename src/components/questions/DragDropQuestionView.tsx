import { useMemo, useState, type ReactNode } from 'react';
import { DndContext, MouseSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import type { DragDropQuestion } from '../../types/content';
import { CheckButton, shuffle, type QProps } from './shared';

const POOL = '__pool';

export function DragDropQuestionView({ q, onResult, locked }: QProps<DragDropQuestion>) {
  const items = useMemo(() => shuffle(q.items), [q]);
  const [place, setPlace] = useState<Record<string, string>>({}); // itemId -> bucketId
  const [picked, setPicked] = useState<string | null>(null); // Tippen-Modus
  // Touch mit kurzer Verzögerung, damit man auf dem Handy noch scrollen kann.
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  );

  const move = (itemId: string, target: string) =>
    setPlace((p) => {
      const n = { ...p };
      if (target === POOL) delete n[itemId];
      else n[itemId] = target;
      return n;
    });

  const onDragEnd = (e: DragEndEvent) => {
    if (e.over) move(String(e.active.id), String(e.over.id));
    setPicked(null);
  };

  const tapTarget = (target: string) => {
    if (locked || !picked) return;
    move(picked, target);
    setPicked(null);
  };

  const check = () => {
    const wrong = q.items.filter((it) => place[it.id] !== q.solution[it.id]);
    const label = (b: string) => q.buckets.find((x) => x.id === b)!.label;
    onResult({
      correct: wrong.length === 0,
      solution: q.buckets
        .map((b) => `${b.label}: ${q.items.filter((it) => q.solution[it.id] === b.id).map((it) => it.text).join(', ')}`)
        .join(' · '),
      whyWrong: wrong.map((it) => `„${it.text}“ gehört zu ${label(q.solution[it.id])}, nicht zu ${label(place[it.id])}.`),
    });
  };

  const chip = (id: string) => {
    const it = q.items.find((x) => x.id === id)!;
    const state = locked ? (place[id] === q.solution[id] ? 'right' : 'wrong') : picked === id ? 'picked' : 'idle';
    return <Chip key={id} id={id} text={it.text} state={state} disabled={locked} onTap={() => setPicked(picked === id ? null : id)} />;
  };

  const pool = items.filter((it) => !place[it.id]);

  // Screenreader-Ansagen auf Deutsch statt der englischen dnd-kit-Defaults
  const itemText = (id: string | number) => q.items.find((x) => x.id === id)?.text ?? '';
  const zoneText = (id?: string | number) => (id === POOL ? 'Noch zuordnen' : q.buckets.find((b) => b.id === id)?.label ?? '');
  const announcements = {
    onDragStart: ({ active }: { active: { id: string | number } }) => `„${itemText(active.id)}“ aufgenommen.`,
    onDragOver: ({ active, over }: { active: { id: string | number }; over: { id: string | number } | null }) =>
      over ? `„${itemText(active.id)}“ über ${zoneText(over.id)}.` : undefined,
    onDragEnd: ({ active, over }: { active: { id: string | number }; over: { id: string | number } | null }) =>
      over ? `„${itemText(active.id)}“ in ${zoneText(over.id)} abgelegt.` : `„${itemText(active.id)}“ losgelassen.`,
    onDragCancel: ({ active }: { active: { id: string | number } }) => `Ziehen von „${itemText(active.id)}“ abgebrochen.`,
  };

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd} accessibility={{ announcements }}>
      <p className="mb-2 text-sm text-slate-400">Ziehen oder antippen und dann das Ziel antippen.</p>
      {!locked && (
        <Zone id={POOL} label="Noch zuordnen" onTap={() => tapTarget(POOL)} highlight={!!picked}>
          {pool.length ? pool.map((it) => chip(it.id)) : <span className="text-sm text-slate-500">Alles zugeordnet ✓</span>}
        </Zone>
      )}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {q.buckets.map((b) => (
          <Zone key={b.id} id={b.id} label={b.label} onTap={() => tapTarget(b.id)} highlight={!!picked}>
            {items.filter((it) => place[it.id] === b.id).map((it) => chip(it.id))}
          </Zone>
        ))}
      </div>
      {!locked && <CheckButton disabled={pool.length > 0} onClick={check} />}
    </DndContext>
  );
}

function Zone({ id, label, children, onTap, highlight }: { id: string; label: string; children: ReactNode; onTap: () => void; highlight: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      onClick={onTap}
      className={`min-h-20 rounded-xl border-2 border-dashed p-2 transition ${
        isOver ? 'border-cyan-400 bg-cyan-400/10' : highlight ? 'border-slate-500' : 'border-slate-700'
      }`}
    >
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

const chipColors = {
  idle: 'border-slate-600 bg-slate-800',
  picked: 'border-cyan-400 bg-cyan-400/20 ring-2 ring-cyan-400',
  right: 'border-emerald-500 bg-emerald-500/20',
  wrong: 'border-rose-500 bg-rose-500/20',
};

function Chip({ id, text, state, disabled, onTap }: { id: string; text: string; state: keyof typeof chipColors; disabled: boolean; onTap: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id, disabled });
  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onTap();
      }}
      style={transform ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 50 } : undefined}
      className={`rounded-lg border-2 px-3 py-1.5 text-sm select-none ${chipColors[state]} ${isDragging ? 'opacity-80 shadow-xl' : ''}`}
    >
      {text}
    </button>
  );
}
