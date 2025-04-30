import { Observable } from "rxjs";
import { AddArgument } from "./arguments/add.argument.class";

export interface ObservableSet<T, I extends Iterable<T> = Iterable<T>>
  extends Set<T> {
  add(args: AddArgument<T>): this;
  add(value: T): this;

  clear: (() => void) | ((triggerEvents?: Iterable<Event>) => void);

  delete(value: T): boolean;
  delete(args: { value: T; triggerEvents?: Iterable<Event> }): boolean;

  addAll:
    | ((...items: T[]) => this)
    | ((args: {
        iterable: Iterable<T>;
        triggerEvents?: Iterable<Event>;
      }) => this);

  deleteAll:
    | ((...items: T[]) => this)
    | ((args: {
        iterable: Iterable<T>;
        triggerEvents?: Iterable<Event>;
      }) => this);

  deleteDifference:
    | ((...items: T[]) => this)
    | ((args: {
        iterable: Iterable<T>;
        triggerEvents?: Iterable<Event>;
      }) => this);

  difference:
    | ((...items: T[]) => ObservableSet<T, I>)
    | ((args: {
        iterable: Iterable<T>;
        triggerEvents?: Iterable<Event>;
      }) => ObservableSet<T, I>);

  readonly add$: Observable<T>;
  readonly addAll$: Observable<I>;
  readonly delete$: Observable<T>;
  readonly deleteAll$: Observable<I>;
  readonly deleteDifference$: Observable<I>;
  readonly values$: Observable<T[]>;
  readonly clear$: Observable<this>;
  readonly change$: Observable<this>;
}
