type Op =
  | { type: "="; l: string; r: string }
  | { type: "-"; l: string }
  | { type: "+"; r: string };

export function myersDiff(oldLines: string[], newLines: string[]): Op[] {
  const n = oldLines.length;
  const m = newLines.length;
  const maxEdits = n + m;

  const furthestX: Record<number, number> = {};
  furthestX[1] = 0;
  const trace: Record<number, Record<number, number>> = {};

  let foundD = -1;

  outer: for (let d = 0; d <= maxEdits; d++) {
    trace[d] = {};

    for (let k = -d; k <= d; k += 2) {
      const leftX = furthestX[k - 1] ?? Number.NEGATIVE_INFINITY;
      const rightX = furthestX[k + 1] ?? Number.NEGATIVE_INFINITY;

      let x: number;
      if (k === -d || (k !== d && leftX < rightX)) {
        x = rightX;
      } else {
        x = leftX + 1;
      }

      let y = x - k;

      while (x < n && y < m && oldLines[x] === newLines[y]) {
        x++;
        y++;
      }

      furthestX[k] = x;
      trace[d][k] = x;

      if (x >= n && y >= m) {
        foundD = d;
        break outer;
      }
    }
  }

  if (foundD === -1) {
    throw new Error("no path found - should not happen though :^)");
  }

  return buildEditScript(trace, oldLines, newLines, foundD);
}

function buildEditScript(
  trace: Record<number, Record<number, number>>,
  oldLines: string[],
  newLines: string[],
  finalD: number,
): Op[] {
  let x = oldLines.length;
  let y = newLines.length;
  const ops: Op[] = [];

  for (let d = finalD; d > 0; d--) {
    const row = trace[d];
    const prevRow = trace[d - 1];

    const k = x - y;

    const prevLeft = prevRow[k - 1] ?? Number.NEGATIVE_INFINITY;
    const prevRight = prevRow[k + 1] ?? Number.NEGATIVE_INFINITY;

    let prevK: number;
    if (k === -d || (k !== d && prevLeft < prevRight)) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }

    const prevX = prevRow[prevK];
    const prevY = prevX - prevK;

    while (x > prevX && y > prevY) {
      ops.push({ type: "=", l: oldLines[x - 1], r: newLines[y - 1] });
      x--;
      y--;
    }

    if (x === prevX) {
      ops.push({ type: "+", r: newLines[y - 1] });
      y--;
    } else {
      ops.push({ type: "-", l: oldLines[x - 1] });
      x--;
    }
  }

  while (x > 0 && y > 0) {
    ops.push({ type: "=", l: oldLines[x - 1], r: newLines[y - 1] });
    x--;
    y--;
  }

  return ops.reverse();
}

export function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

export interface SplitRow {
  left: string;
  right: string;
  type: "=" | "-" | "+";
}

export default function getSplitDiffRows(
  left: string[],
  right: string[],
): SplitRow[] {
  const ops = myersDiff(left, right);
  return ops.map((op) => {
    if (op.type === "=") return { left: op.l, right: op.r, type: "=" };
    if (op.type === "-") return { left: op.l, right: "", type: "-" };
    return { left: "", right: op.r, type: "+" };
  });
}
