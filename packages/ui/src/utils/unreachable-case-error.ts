export class UnreachableCaseError extends Error {
  constructor(value: never) {
    let serialized;
    try {
      serialized = JSON.stringify(value);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      serialized = `${value}`;
    }
    super(`Unreachable case: ${serialized}`);
  }
}
