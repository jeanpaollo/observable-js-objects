export class ValueNotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? "A value field was not provided");
  }
}
