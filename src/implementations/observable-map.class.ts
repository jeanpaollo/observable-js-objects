import { Nillable } from "nullish-utils";
import { Observable, Subject, map, startWith } from "rxjs";
import { ObservableMap } from "../interfaces/observable-map.interface";

export class ObservableMapImpl<K, V>
  extends Map<K, V>
  implements ObservableMap<K, V>
{
  private readonly _set$ = new Subject<[K, V]>();
  readonly set$ = this._set$.asObservable();

  private readonly _clear$ = new Subject<this>();
  readonly clear$ = this._clear$.asObservable();

  private readonly _delete$ = new Subject<Nillable<[K, V]>>();
  readonly delete$ = this._delete$.asObservable();

  private readonly _change$ = new Subject<this>();
  readonly change$ = this._change$.asObservable();

  readonly values$ = this.change$.pipe(
    startWith(null),
    map(() => this.entries())
  ) as Observable<IterableIterator<[K, V]>>;

  set(key: K, value: V) {
    this._set$?.next([key, value]);
    return super.set(key, value);
  }

  clear() {
    this._clear$?.next(this);
    return super.clear();
  }

  delete(key: K) {
    const value = super.get(key);
    this._delete$?.next(value && [key, value]);
    return super.delete(key);
  }
}
