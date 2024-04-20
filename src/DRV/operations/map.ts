import { DRV } from "../DRV";

export function map(p: DRV, fun: (num: number) => number, getHash: (hash: string) => string) {
  const dict = new Map<number, number>();
  let newBase = Number.POSITIVE_INFINITY;
  let newMax = Number.NEGATIVE_INFINITY;

  for (const [num, prob] of p.items()) {
    const newNum = fun(num);

    newBase = newNum < newBase ? newNum : newBase;
    newMax = newNum > newMax ? newNum : newMax;

    dict.set(newNum, dict.has(newNum) ? dict.get(newNum)! + prob : prob);
  }

  const probabilities = new Array<number>(newMax - newBase + 1).fill(0);
  for (const [num, prob] of dict.entries()) {
    probabilities[num - newBase] = prob;
  }

  return new DRV(newBase, probabilities, getHash?.(p.hash));
}
