import { ValueNotFoundError } from "../errors";

export type Args<T> = { value: T; triggerEvents?: Iterable<Event> };

export class SingleValueArgument<T> {
  static of<T>(args: Args<T>) {
    return new SingleValueArgument(args);
  }

  constructor(args: { value: T; triggerEvents?: Iterable<Event> }) {
    if (!("value" in args)) throw new ValueNotFoundError();

    Object.assign(this, args);
  }
}
