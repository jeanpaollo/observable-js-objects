import { Observable } from "rxjs";

export interface ObservableSet<
  T,
  O extends Observable<T> = Observable<T>,
  I extends Iterable<T> = Iterable<T>
> extends Set<T> {
  addAll: (...items: T[]) => ObservableSet<T, O, I>;
  deleteAll: (...items: T[]) => ObservableSet<T, O, I>;
  readonly add$: Observable<T>;
  readonly addAll$: Observable<I>;
  readonly delete$: Observable<T>;
  readonly deleteAll$: Observable<I>;
  readonly values$: Observable<T[]>;
  readonly clear$: Observable<ObservableSet<T, O, I>>;
  readonly change$: Observable<ObservableSet<T, O, I>>;
}
