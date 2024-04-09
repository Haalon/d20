export function cache<T extends any[], R>(fun: (...args: T) => R, getKey: (...args: T) => string) {
  const cache: Record<string, R> = {};

  return (...args: T) => {
    const cacheKey = getKey(...args);

    if (cacheKey in cache) return cache[cacheKey];

    const res = fun(...args);
    cache[cacheKey] = res;

    return res;
  };
}
