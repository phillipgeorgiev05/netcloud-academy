/** Zieht nur die Tabellen aus einem Lektionstext (zusammenhängende Zeilen mit "|"). */
export function tablesOf(body: string): string[] {
  const out: string[][] = [];
  let prevTable = false;
  for (const line of body.split('\n')) {
    const isTable = line.trim().startsWith('|');
    if (isTable) (prevTable ? out[out.length - 1] : out[out.push([]) - 1]).push(line);
    prevTable = isTable;
  }
  return out.map((t) => t.join('\n'));
}
