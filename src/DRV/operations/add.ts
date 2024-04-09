import { DRV } from "../DRV";
import { binaryReduce } from "../utils/binaryReduce";
import { cache } from "../utils/cache";

function addInternal(p: DRV, q: DRV): DRV {
  const resultMin = p.minValue + q.minValue;
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

const addCached = cache(addInternal, (p, q) => p.hash + "+" + q.hash);

export const add = (...args: DRV[]) => binaryReduce(addCached, args);
