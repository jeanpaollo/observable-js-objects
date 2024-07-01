import { Observable, Subject, map, merge, shareReplay, startWith } from "rxjs";
import { ObservableSet } from "../interfaces/observable-set.interface";

export class ObservableSetImpl<T, I extends Iterable<T> = Iterable<T>>
  extends Set<T>
  implements ObservableSet<T, I>
{
  static of<T>(args?: Iterable<T>) {
    return new ObservableSetImpl(args);
  }

  //TODO: Hide this property
  private readonly _add$ = new Subject<T>();
  readonly add$ = this._add$.asObservable();

  //TODO: Hide this property
  private readonly _addAll$ = new Subject<I>();
  readonly addAll$ = this._addAll$.asObservable();

  //TODO: Hide this property
  private readonly _delete$ = new Subject<T>();
  readonly delete$ = this._delete$.asObservable();

  //TODO: Hide this property
  private readonly _clear$ = new Subject<this>();
  readonly clear$ = this._clear$.asObservable();

  //TODO: Hide this property
  readonly _deleteAll$ = new Subject<I>();
  readonly deleteAll$ = this._deleteAll$.asObservable();

  readonly change$ = merge(this.add$, this.delete$, this.clear$).pipe(
    map(() => this)
  ) as Observable<this>;

  readonly values$: Observable<T[]> = this.change$.pipe(
    startWith(this),
    map((_) => Array.from(_)),
    shareReplay(1)
  );

  constructor(items?: Iterable<T>) {
    super();
    if (items) for (let item of items) this.add(item);

    //TODO: Refactor this code
    Object.defineProperties(this, {
      add: {
        get() {
          return ObservableSetImpl.prototype.add.bind(this);
        },
      },
      addAll: {
        get() {
          return ObservableSetImpl.prototype.addAll.bind(this);
        },
      },
      delete: {
        get() {
          return ObservableSetImpl.prototype.delete.bind(this);
        },
      },
      deleteAll: {
        get() {
          return ObservableSetImpl.prototype.deleteAll.bind(this);
        },
      },
      clear: {
        get() {
          return ObservableSetImpl.prototype.clear.bind(this);
        },
      },
      has: {
        get() {
          return ObservableSetImpl.prototype.has.bind(this);
        },
      },
    });
  }

  addAll(...items: T[]) {
    (items ?? []).forEach((e) => this.add(e));
    this._addAll$.next(items as unknown as I);

    return this;
  }

  deleteAll(...items: T[]) {
    (items ?? []).forEach((e) => this.delete(e));
    this._deleteAll$.next(items as unknown as I);

    return this;
  }

  override add(item: T) {
    if (!this.has(item)) {
      super.add(item);
      this._add$?.next(item);
    }

    return this;
  }

  override delete(item: T) {
    const deleted = super.delete(item);
    if (deleted) this._delete$.next(item);

    return deleted;
  }

  override clear() {
    super.clear();
    this._clear$.next(this);

    return this;
  }
}
