// discrete random variable
export class DRV {
  base: number;
  probabilities: readonly number[];

  _hash?: string;

  constructor(base = 1, probabilities = [1], hash?: string) {
    this.base = base;
    this.probabilities = probabilities;
    this.probabilities;
    this._hash = hash;
  }

  get hash() {
    if (this._hash) return this._hash;
    else return this.base + JSON.stringify(this.probabilities);
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

  get minVal() {
    return this.base;
  }
  get maxVal() {
    return this.base + this.probabilities.length;
  }
}
