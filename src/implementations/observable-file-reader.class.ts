import {
  BehaviorSubject,
  distinctUntilChanged,
  EMPTY,
  filter,
  first,
  fromEvent,
  map,
  merge,
  Observable,
  of,
  share,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from "rxjs";
import { ObservableFileReader } from "../interfaces/observable-file-reader.interface";
export class ObservableFileReaderImpl<T extends Blob = Blob>
  extends FileReader
  implements ObservableFileReader
{
  static readonly of = (blob: Blob) => new ObservableFileReaderImpl(blob);

  static readonly result = Object.freeze({
    readAsArrayBuffer: (blob: Blob) => new ObservableFileReaderImpl(blob),
  });

  readonly abortEvent$ = fromEvent<ProgressEvent>(this, "abort").pipe(share());

  readonly errorEvent$ = fromEvent<ProgressEvent>(this, "error").pipe(share());

  readonly loadEvent$ = fromEvent<ProgressEvent>(this, "load").pipe(share());

  readonly loadEndEvent$ = fromEvent<ProgressEvent>(this, "loadend").pipe(
    share()
  );

  readonly loadStartEvent$ = fromEvent<ProgressEvent>(this, "loadstart").pipe(
    share()
  );

  readonly progressEvent$ = fromEvent<ProgressEvent>(this, "progress").pipe(
    share()
  );

  readonly readyState$ = this.progressEvent$.pipe(
    startWith(null),
    map(() => this.readyState),
    distinctUntilChanged(),
    shareReplay(1)
  );

  readonly result$ = merge(
    this.readyState$.pipe(filter((e) => e === 2)),
    this.loadEvent$
  ).pipe(
    map(() => this.result),
    shareReplay(1)
  );

  readonly error$ = this.loadEndEvent$.pipe(
    map(() => this.error),
    share()
  );

  private readonly _blob$ = new BehaviorSubject<T | undefined | null>(null);

  readonly blob$ = this._blob$.asObservable();

  readonly arrayBuffer$ = this.observableOperation<ArrayBuffer>(
    this.readAsArrayBuffer
  );

  readonly dataURL$ = this.observableOperation<string>(this.readAsDataURL);

  readonly binaryString$ = this.observableOperation<string>(
    this.readAsBinaryString
  );

  readonly text$ = this.observableOperation<string>(this.readAsText);

  set blob(value) {
    this._blob$.next(value);
  }

  get blob() {
    return this._blob$.value;
  }

  constructor(blob?: T) {
    super();
    blob && this._blob$.next(blob);
  }

  observableOperation<R>(fn: (...args: any[]) => any) {
    return of(null).pipe(
      tap(() => {
        if (this.readyState === 1) throw Error("Another operation in progress");
      }),
      switchMap(() => this.blob$.pipe(first())),
      switchMap((blob) => {
        if (!blob) return EMPTY;

        setTimeout(() => fn.call(this, blob), 5);
        return this.loadEvent$.pipe(
          switchMap(() => this.result$)
        ) as Observable<R>;
      }),
      shareReplay(1)
    );
  }
}
