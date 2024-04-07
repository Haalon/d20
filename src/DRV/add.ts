import { cache } from "../utils/cache";
import { DRV } from "./DRV";

function addInternal(p: DRV, q: DRV): DRV {
  const resultMin = p.minVal + q.minVal;

  const resultProbabilities = [];

  for (let i = 0; i < p.probabilities.length + q.probabilities.length - 1; i++) {
    let probability = 0;

    for (let j = q.probabilities.length - 1; j >= 0; j--) {
      probability += q.probabilityAtIndex(j) * p.probabilityAtIndex(i - j);
    }
    resultProbabilities.push(probability);
  }

  return new DRV(resultMin, resultProbabilities, p.hash + "+" + q.hash);
}

export const add = cache(addInternal, (p, q) => p.hash + "+" + q.hash);
