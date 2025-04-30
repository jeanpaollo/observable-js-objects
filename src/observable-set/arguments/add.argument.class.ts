import { Args, SingleValueArgument } from "../../arguments";

export class AddArgument<T> extends SingleValueArgument<T> {
  static of<T>(args: Args<T>) {
    return new AddArgument(args);
  }
}
