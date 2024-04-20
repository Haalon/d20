import { add, multiply, sub } from "./operations/combine";
import { map } from "./operations/map";
import { max } from "./operations/max";
import { min } from "./operations/min";

import { range } from "./utils/range";

// discrete random variable
export class DRV {
  private readonly base: number;
  private readonly probabilities: readonly number[];

  hash: string;

  constructor(base = 1, probabilities = [1], hash?: string) {
    this.base = base;
    this.probabilities = probabilities;
    this.probabilities;
    this.hash = hash ?? base + ":" + JSON.stringify(probabilities);
  }

  static Die(n: number) {
    return new DRV(1, new Array(n).fill(1 / n), `d${n}`);
  }

  static Uniform(from: number, to: number) {
    const size = to - from + 1;
    return new DRV(from, new Array(size).fill(1 / size), `u(${to},${from})`);
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

  *values(reverse = false) {
    for (const i of range(0, this.probabilities.length, reverse ? -1 : 1)) {
      const element = this.probabilities[i];
      if (!element) continue;

      yield this.base + i;
    }
  }

  *items(reverse = false) {
    for (const i of range(0, this.probabilities.length, reverse ? -1 : 1)) {
      const element = this.probabilities[i];
      if (!element) continue;

      yield [this.base + i, element] as const;
    }
  }

  map(fun: (num: number) => number, getHash: (hash: string) => string) {
    return map(this, fun, getHash);
  }

  static min = min;
  min(...args: DRV[]) {
    return DRV.min(this, ...args);
  }
  lowestOf(n: number) {
    return min(...new Array<DRV>(n).fill(this));
  }

  static max = max;
  max(...args: DRV[]) {
    return DRV.max(this, ...args);
  }
  highestOf(n: number) {
    return max(...new Array<DRV>(n).fill(this));
  }

  static add = add;
  add(...args: DRV[]) {
    return DRV.add(this, ...args);
  }
  times(n: number) {
    return add(...new Array<DRV>(n).fill(this));
  }

  static multiply = multiply;
  multiply(...args: DRV[]) {
    return DRV.multiply(this, ...args);
  }

  static sub = sub;
  sub(other: DRV) {
    return sub(this, other);
  }
}
