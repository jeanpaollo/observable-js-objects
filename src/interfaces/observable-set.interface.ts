import { Observable } from "rxjs";

export interface ObservableSet<T, I extends Iterable<T> = Iterable<T>>
  extends Set<T> {
  addAll: (...items: T[]) => this;
  deleteAll: (...items: T[]) => this;
  readonly add$: Observable<T>;
  readonly addAll$: Observable<I>;
  readonly delete$: Observable<T>;
  readonly deleteAll$: Observable<I>;
  readonly values$: Observable<T[]>;
  readonly clear$: Observable<this>;
  readonly change$: Observable<this>;
}
