export class UnreachableCaseError extends Error {
  constructor(value: never) {
    let serialized;
    try {
      serialized = JSON.stringify(value);
    } catch (e) {
      serialized = `${value}`;
    }
    super(`Unreachable case: ${serialized}`);
  }
}
