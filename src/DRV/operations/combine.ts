import { DRV } from "../DRV";
import { binaryReduce } from "../utils/binaryReduce";
import { cache } from "../utils/cache";

export enum BinaryFunctionGrowth {
  UNKNOWN,
  P_POSITIVE_Q_POSITIVE,
  P_POSITIVE_Q_NEGATIVE,
  P_NEGATIVE_Q_POSITIVE,
  P_NEGATIVE_Q_NEGATIVE,
}

function combineGeneric(
  p: DRV,
  q: DRV,
  fun: (a: number, b: number) => number,
  getHash?: (a: string, b: string) => string
): DRV {
  const valueDict: Record<string, number> = {};
  let minVal = Number.POSITIVE_INFINITY;

  for (const [pVal, pProb] of p.items())
    for (const [qVal, qProb] of q.items()) {
      const combinedVal = fun(pVal, qVal);
      if (combinedVal < minVal) minVal = combinedVal;

      const combinedProb = pProb * qProb;
      valueDict[combinedVal] = valueDict[combinedVal] ? valueDict[combinedVal] + combinedProb : combinedProb;
    }

  const probabilities = [];
  for (const [val, prob] of Object.entries(valueDict)) {
    const index = +val - minVal;
    probabilities[index] = prob;
  }

  const hash = getHash ? getHash(p.hash, q.hash) : p.hash + "~" + q.hash;
  return new DRV(minVal, probabilities, hash);
}

export function combine(
  p: DRV,
  q: DRV,
  fun: (a: number, b: number) => number,
  getHash?: (a: string, b: string) => string,
  functionGrowth: BinaryFunctionGrowth = 0
): DRV {
  if (!functionGrowth) return combineGeneric(p, q, fun, getHash);

  let minVal: number;
  switch (functionGrowth) {
    case BinaryFunctionGrowth.P_POSITIVE_Q_POSITIVE:
      minVal = fun(p.minValue, q.minValue);
      break;
    case BinaryFunctionGrowth.P_POSITIVE_Q_NEGATIVE:
      minVal = fun(p.minValue, q.maxValue);
      break;
    case BinaryFunctionGrowth.P_NEGATIVE_Q_POSITIVE:
      minVal = fun(p.maxValue, q.minValue);
      break;
    case BinaryFunctionGrowth.P_NEGATIVE_Q_NEGATIVE:
      minVal = fun(p.maxValue, q.maxValue);
      break;
  }

  const probabilities: number[] = [];
  for (const [pVal, pProb] of p.items())
    for (const [qVal, qProb] of q.items()) {
      const combinedVal = fun(pVal, qVal);
      const combinedProb = pProb * qProb;

      const index = combinedVal - minVal;
      probabilities[index] = probabilities[index] ? probabilities[index] + combinedProb : combinedProb;
    }

  const hash = getHash ? getHash(p.hash, q.hash) : p.hash + "~" + q.hash;
  return new DRV(minVal, probabilities, hash);
}

const addInternal = (p: DRV, q: DRV) =>
  combine(
    p,
    q,
    (a, b) => a + b,
    (a, b) => a + "+" + b,
    BinaryFunctionGrowth.P_POSITIVE_Q_POSITIVE
  );
const addCached = cache(addInternal, (p, q) => p.hash + "+" + q.hash);
export const add = (...args: DRV[]) => binaryReduce(addCached, args);

const multiplyInternal = (p: DRV, q: DRV) =>
  combine(
    p,
    q,
    (a, b) => a * b,
    (a, b) => a + "*" + b,
    BinaryFunctionGrowth.P_POSITIVE_Q_POSITIVE
  );
const multiplyCached = cache(multiplyInternal, (p, q) => p.hash + "*" + q.hash);
export const multiply = (...args: DRV[]) => binaryReduce(multiplyCached, args);

const subInternal = (p: DRV, q: DRV) =>
  combine(
    p,
    q,
    (a, b) => a - b,
    (a, b) => a + "-" + b,
    BinaryFunctionGrowth.P_POSITIVE_Q_NEGATIVE
  );
export const sub = cache(subInternal, (p, q) => p.hash + "-" + q.hash);
