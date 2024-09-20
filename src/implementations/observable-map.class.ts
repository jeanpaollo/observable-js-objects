import { Nillable } from "nullish-utils";
import { Observable, Subject, map, merge, startWith } from "rxjs";
import { ObservableMap } from "../interfaces/observable-map.interface";

export class ObservableMapImpl<K, V>
  extends Map<K, V>
  implements ObservableMap<K, V>
{
  static of<K, V>(entries?: readonly (readonly [K, V])[] | null) {
    return new ObservableMapImpl(entries);
  }

  private readonly _set$ = new Subject<[K, V]>();
  readonly set$ = this._set$.asObservable();

  private readonly _clear$ = new Subject<this>();
  readonly clear$ = this._clear$.asObservable();

  private readonly _delete$ = new Subject<Nillable<[K, V]>>();
  readonly delete$ = this._delete$.asObservable();

  readonly change$ = merge(this.set$, this.delete$, this.clear$).pipe(
    map(() => this)
  ) as Observable<this>;

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
