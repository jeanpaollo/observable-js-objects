import { Nillable } from "nullish-utils";
import { Observable } from "rxjs";

export interface ObservableMap<K, V> extends Map<K, V> {
  readonly set$: Observable<[K, V]>;
  readonly clear$: Observable<this>;
  readonly delete$: Observable<Nillable<[K, V]>>;
  readonly values$: Observable<IterableIterator<[K, V]>>;
  readonly change$: Observable<this>;
}
