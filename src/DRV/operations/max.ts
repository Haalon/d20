import { DRV } from "../DRV";
import { binaryReduce } from "../utils/binaryReduce";
import { cache } from "../utils/cache";

function maxInternal(p: DRV, q: DRV): DRV {
  const resultBase = Math.max(p.minValue, q.minValue);
  const maxVal = Math.max(p.maxValue, q.maxValue);

  const probabilities = [];

  // probability of p (q) of being more or equal than i
  let p_acc = 1;
  let q_acc = 1;

  for (let i = maxVal; i >= resultBase; i--) {
    let probability = 0;

    const p_prob = p.probabilityAtValue(i);
    const q_prob = q.probabilityAtValue(i);

    probability += p_prob * q_acc + q_prob * p_acc - q_prob * p_prob;
    p_acc -= p_prob;
    q_acc -= q_prob;

    probabilities.unshift(probability);
  }

  return new DRV(resultBase, probabilities, `max(${p.hash}, ${q.hash})`);
}

const maxCached = cache(maxInternal, (p, q) => `max(${p.hash}, ${q.hash})`);

export const max = (...args: DRV[]) => binaryReduce(maxCached, args);
