export function isTruthy<T>(x: T | false | undefined | null | '' | 0): x is T {
  return !!x;
}
