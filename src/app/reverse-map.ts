export function reverseMap<K, V>(x: Map<K, V>) {
  const y = new Map<V, K[]>();
  x.forEach((k, v) => y.set(k, (y.get(k) || []).concat(v)));
  return y;
}
