export function* range(start: number, stop: number, step: number = 1): Iterable<number> {
  if (step === 0) {
    throw new Error("Step cannot be zero.");
  }

  if (start >= stop) return;

  if (step < 0)
    for (let i = stop - 1; i >= start; i += step) {
      yield i;
    }
  else
    for (let i = start; i < stop; i += step) {
      yield i;
    }
}
