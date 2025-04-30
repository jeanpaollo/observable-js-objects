import { Observable } from "rxjs";

export interface ObservableArray<T = object> extends Array<T> {
  deleteDifference: (...items: T[]) => this;
  readonly pop$: Observable<T | undefined>;
  readonly push$: Observable<T[]>;
  readonly concat$: Observable<(T | ConcatArray<T>)[]>;
  readonly reverse$: Observable<this>;
  readonly shift$: Observable<T | undefined>;
  readonly sort$: Observable<this>;
  readonly splice$: Observable<T[]>;
  readonly unshift$: Observable<T[]>;
  readonly change$: Observable<this>;
  readonly values$: Observable<this>;
  readonly deleteDifference$: Observable<T[]>;
}
