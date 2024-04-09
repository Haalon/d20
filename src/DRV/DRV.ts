import { add } from "./operations/add";
import { min } from "./operations/min";

// discrete random variable
export class DRV {
  readonly base: number;
  readonly probabilities: readonly number[];

  readonly hash: string;

  constructor(base = 1, probabilities = [1], hash?: string) {
    this.base = base;
    this.probabilities = probabilities;
    this.probabilities;
    this.hash = hash ?? base + ":" + JSON.stringify(probabilities);
  }

  static Die(n: number) {
    return new DRV(1, new Array(n).fill(1 / n), `d${n}`);
  }

  static Die0(n: number) {
    return new DRV(0, new Array(n + 1).fill(1 / (n + 1)), `p${n}`);
  }

  static Const(n: number) {
    return new DRV(n, [1], `${n}`);
  }

  probabilityAtValue(n: number) {
    return this.probabilities[n - this.base] ?? 0;
  }

  probabilityAtIndex(n: number) {
    return this.probabilities[n] ?? 0;
  }

  get minValue() {
    return this.base;
  }
  get maxValue() {
    return this.base + this.probabilities.length - 1;
  }

  *values() {
    for (let i = 0; i < this.probabilities.length; i++) {
      const element = this.probabilities[i];
      if (!element) continue;

      yield this.base + i;
    }
  }

  *items() {
    for (let i = 0; i < this.probabilities.length; i++) {
      const element = this.probabilities[i];
      if (!element) continue;

      yield [this.base + i, element] as const;
    }
  }

  map(fun: (num: number) => number, getHash: (hash: string) => string) {
    const dict = new Map<number, number>();
    let newBase = Number.POSITIVE_INFINITY;
    let newMax = Number.NEGATIVE_INFINITY;

    for (const [num, prob] of this.items()) {
      const newNum = fun(num);

      newBase = newNum < newBase ? newNum : newBase;
      newMax = newNum > newMax ? newNum : newMax;

      dict.set(newNum, dict.has(newNum) ? dict.get(newNum)! + prob : prob);
    }

    const probabilities = new Array<number>(newMax - newBase + 1).fill(0);
    for (const [num, prob] of dict.entries()) {
      probabilities[num - newBase] = prob;
    }

    return new DRV(newBase, probabilities, getHash?.(this.hash));
  }

  static min = min;
  min(...args: DRV[]) {
    return DRV.min(this, ...args);
  }
  lowestOf(n: number) {
    return min(...new Array<DRV>(n).fill(this));
  }

  static add = add;
  add(...args: DRV[]) {
    return DRV.add(this, ...args);
  }
  times(n: number) {
    return add(...new Array<DRV>(n).fill(this));
  }
}
