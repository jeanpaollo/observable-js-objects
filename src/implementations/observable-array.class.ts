import { map, merge, Observable, share, startWith, Subject } from "rxjs";
import { ObservableArray } from "../interfaces";

export class ObservableArrayImpl<T>
  extends Array<T>
  implements ObservableArray<T>
{
  private readonly _pop$ = new Subject<T | undefined>();
  readonly pop$ = this._pop$.asObservable();

  private readonly _push$ = new Subject<T[]>();
  readonly push$ = this._push$.asObservable();

  private readonly _concat$ = new Subject<(T | ConcatArray<T>)[]>();
  readonly concat$ = this._concat$.asObservable();

  private readonly _reverse$ = new Subject<this>();
  readonly reverse$ = this._reverse$.asObservable();

  private readonly _shift$ = new Subject<T | undefined>();
  readonly shift$ = this._shift$.asObservable();

  private readonly _sort$ = new Subject<this>();
  readonly sort$ = this._sort$.asObservable();

  private readonly _splice$ = new Subject<T[]>();
  readonly splice$ = this._splice$.asObservable();

  private readonly _unshift$ = new Subject<T[]>();
  readonly unshift$ = this._unshift$.asObservable();

  readonly change$: Observable<this> = merge(
    this.pop$,
    this.push$,
    this.concat$,
    this.reverse$,
    this.shift$,
    this.sort$,
    this.splice$,
    this.unshift$
  ).pipe(
    map(() => this),
    share()
  );

  readonly values$: Observable<this> = this.change$.pipe(startWith(this));

  override pop(): T | undefined {
    const _return = super.pop();

    this._pop$.next(_return);

    return _return;
  }

  override push(...items: T[]): number {
    const _return = super.push(...items);

    this._push$.next(items);

    return _return;
  }

  override concat(...items: (T | ConcatArray<T>)[]): T[] {
    const _return = super.concat(...items);

    this._concat$.next(items);

    return _return;
  }

  override reverse(): T[] {
    super.reverse();

    this._reverse$.next(this);

    return this;
  }

  override shift(): T | undefined {
    const _return = super.shift();

    this._shift$.next(_return);

    return _return;
  }

  override sort(compareFn?: ((a: T, b: T) => number) | undefined): this {
    super.sort(compareFn);

    this._sort$.next(this);

    return this;
  }

  override splice(start: number, deleteCount: number, ...items: T[]): T[] {
    const _return = super.splice(start, deleteCount, ...items);

    this._splice$.next(_return);

    return _return;
  }

  override unshift(...items: T[]): number {
    const _return = super.unshift(...items);

    this._unshift$.next(items);

    return _return;
  }
}
