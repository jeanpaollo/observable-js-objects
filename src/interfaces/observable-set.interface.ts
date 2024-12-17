import { Observable } from "rxjs";

export interface ObservableSet<T, I extends Iterable<T> = Iterable<T>>
  extends Set<T> {
  add(value: T): this;
  addAll: (...items: T[]) => this;
  clear(): void;
  delete(value: T): boolean;
  deleteAll: (...items: T[]) => this;
  deleteDifference: (...items: T[]) => this;
  difference<U>(other: ReadonlySetLike<U>): ObservableSet<T>;
  intersection<U>(other: ReadonlySetLike<U>): ObservableSet<T & U>;
  filter: (
    predicate: (item: T, index?: number) => boolean
  ) => ObservableSet<T, I>;
  resetTo: (...items: T[]) => this;
  symmetricDifference<U>(other: ReadonlySetLike<U>): ObservableSet<T | U>;
  union<U>(other: ReadonlySetLike<U>): ObservableSet<T | U>;

  readonly add$: Observable<T>;
  readonly addAll$: Observable<I>;
  readonly delete$: Observable<T>;
  readonly deleteAll$: Observable<I>;
  readonly values$: Observable<T[]>;
  readonly clear$: Observable<this>;
  readonly change$: Observable<this>;
}
