// reduce in a balanced binary tree order, to maximise cache hits
export function binaryReduce<T>(fun: (a: T, b: T) => T, args: T[]): T {
  if (args.length === 1) return args[0];
  if (args.length === 2) return fun(args[0], args[1]);

  let queue = args;
  let acc = [];
  do {
    for (let i = 0; i < queue.length; i += 2) {
      const element1 = queue[i];
      const element2 = queue[i + 1];

      if (!element2) {
        acc.push(element1);
        continue;
      }

      acc.push(fun(element1, element2));
    }

    queue = acc;
    acc = [];
  } while (queue.length !== 1);

  return queue[0];
}
