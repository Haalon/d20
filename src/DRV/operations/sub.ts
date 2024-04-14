import { DRV } from "../DRV";
import { cache } from "../utils/cache";

export function subInternal(p: DRV, q: DRV): DRV {
  const resultMin = p.minValue - q.minValue;
  const resultProbabilities = [];

  for (let i = 0; i < p.probabilities.length + q.probabilities.length - 1; i++) {
    let probability = 0;

    for (let j = 0; j < q.probabilities.length; j++) {
      probability += q.probabilityAtIndex(j) * p.probabilityAtIndex(i - j);
    }
    resultProbabilities.push(probability);
  }

  return new DRV(resultMin, resultProbabilities, p.hash + "-" + q.hash);
}

export const sub = cache(subInternal, (p, q) => p.hash + "-" + q.hash);
