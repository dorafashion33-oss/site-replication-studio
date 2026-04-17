import { useState, useEffect, useRef } from "react";

export type FlashDir = "up" | "down" | "none";

export interface FluctuatedOdd {
  value: number;
  flash: FlashDir;
}

export interface OddCell {
  back: FluctuatedOdd;
  lay: FluctuatedOdd;
}

/**
 * Takes a stable list of base odds keyed by id and returns continuously
 * fluctuating versions with a brief "flash" direction whenever a value changes.
 */
export function useFluctuatingOdds(
  base: Record<string, { back: number; lay: number }>,
  intervalMs = 2500
): Record<string, OddCell> {
  const [state, setState] = useState<Record<string, OddCell>>(() => {
    const out: Record<string, OddCell> = {};
    for (const [k, v] of Object.entries(base)) {
      out[k] = {
        back: { value: v.back, flash: "none" },
        lay: { value: v.lay, flash: "none" },
      };
    }
    return out;
  });

  const baseRef = useRef(base);
  baseRef.current = base;

  // Re-sync when keys change (new matches arrive)
  useEffect(() => {
    setState((prev) => {
      const next: Record<string, OddCell> = { ...prev };
      // add new
      for (const [k, v] of Object.entries(base)) {
        if (!next[k]) {
          next[k] = {
            back: { value: v.back, flash: "none" },
            lay: { value: v.lay, flash: "none" },
          };
        }
      }
      // remove gone
      for (const k of Object.keys(next)) {
        if (!base[k]) delete next[k];
      }
      return next;
    });
  }, [Object.keys(base).join("|")]);

  useEffect(() => {
    const tick = setInterval(() => {
      setState((prev) => {
        const next: Record<string, OddCell> = {};
        for (const [k, cell] of Object.entries(prev)) {
          const baseCell = baseRef.current[k];
          if (!baseCell) {
            next[k] = cell;
            continue;
          }
          // small random walk bounded around base ±15%
          const wiggle = (v: number, basev: number) => {
            const delta = (Math.random() - 0.5) * Math.max(0.04, basev * 0.06);
            const bound = basev * 0.15;
            let nv = v + delta;
            if (nv > basev + bound) nv = basev + bound;
            if (nv < Math.max(1.01, basev - bound)) nv = Math.max(1.01, basev - bound);
            return +nv.toFixed(2);
          };
          const newBack = wiggle(cell.back.value, baseCell.back);
          const newLay = wiggle(cell.lay.value, baseCell.lay);
          next[k] = {
            back: { value: newBack, flash: newBack > cell.back.value ? "up" : newBack < cell.back.value ? "down" : "none" },
            lay: { value: newLay, flash: newLay > cell.lay.value ? "up" : newLay < cell.lay.value ? "down" : "none" },
          };
        }
        return next;
      });

      // clear flashes after 600ms
      setTimeout(() => {
        setState((prev) => {
          const next: Record<string, OddCell> = {};
          for (const [k, cell] of Object.entries(prev)) {
            next[k] = {
              back: { ...cell.back, flash: "none" },
              lay: { ...cell.lay, flash: "none" },
            };
          }
          return next;
        });
      }, 600);
    }, intervalMs);
    return () => clearInterval(tick);
  }, [intervalMs]);

  return state;
}
