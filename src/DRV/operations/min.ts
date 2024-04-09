import { DRV } from "../DRV";
import { binaryReduce } from "../utils/binaryReduce";
import { cache } from "../utils/cache";

function minInternal(p: DRV, q: DRV): DRV {
  const resultBase = Math.min(p.minValue, q.minValue);
  const maxVal = Math.min(p.maxValue, q.maxValue);

  const probabilities = [];

  // probability of p (q) of being more or equal than i
  let p_acc = 1;
  let q_acc = 1;

  for (let i = resultBase; i <= maxVal; i++) {
    let probability = 0;

    const p_prob = p.probabilityAtValue(i);
    const q_prob = q.probabilityAtValue(i);

    probability += p_prob * q_acc + q_prob * p_acc - q_prob * p_prob;
    p_acc -= p_prob;
    q_acc -= q_prob;

    probabilities.push(probability);
  }

  return new DRV(resultBase, probabilities, `min(${p.hash}, ${q.hash})`);
}

const minCached = cache(minInternal, (p, q) => `min(${p.hash}, ${q.hash})`);

export const min = (...args: DRV[]) => binaryReduce(minCached, args);

// export const min = cache(minInternal, (p, q) => `min(${p.hash}, ${q.hash})`);
