import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
  merge,
  of,
  shareReplay,
  Subject,
  switchMap,
  tap,
} from "rxjs";
import {
  DataURL,
  ObservableFileReader,
} from "../interfaces/observable-file-reader.interface";
import { DataURLImpl } from "./data-url.class";
export abstract class AbstractObservableFileReader<
  T extends Blob = Blob,
  R = string | ArrayBuffer | DataURL
> implements ObservableFileReader<T, R>
{
  abstract invoker(source: T): void;
  map(source: any) {
    return source as R;
  }

  protected readonly _fileReader = new FileReader();

  constructor(readonly blob: T) {
    Object.freeze(this);

    this._fileReader.onerror = (event) => {
      this._error$.next(this._fileReader.error);
      this._errorEvent$.next(event);
    };

    this._fileReader.onload = (event) => this._loadEvent$.next(event);

    this._fileReader.onabort = (event) => this._abortEvent$.next(event);

    this._fileReader.onloadend = (event) => this._loadEndEvent$.next(event);

    this._fileReader.onloadstart = (event) => this._loadStartEvent$.next(event);

    this._fileReader.onprogress = (event) => {
      this._progressEvent$.next(event);
      this._readyState$.next(this._fileReader.readyState);
    };
  }

  private readonly _error$ = new Subject<typeof FileReader.prototype.error>();

  readonly error$ = this._error$.asObservable();

  private readonly _abortEvent$ = new Subject<ProgressEvent<FileReader>>();

  readonly abortEvent$ = this._abortEvent$.asObservable();

  private readonly _errorEvent$ = new Subject<ProgressEvent<FileReader>>();

  readonly errorEvent$ = this._errorEvent$.asObservable();

  private readonly _loadEvent$ = new Subject<ProgressEvent<FileReader>>();

  readonly loadEvent$ = this._loadEvent$.asObservable();

  private readonly _loadEndEvent$ = new Subject<ProgressEvent<FileReader>>();

  readonly loadEndEvent$ = this._loadEndEvent$.asObservable();

  private readonly _loadStartEvent$ = new Subject<ProgressEvent<FileReader>>();

  readonly loadStartEvent$ = this._loadStartEvent$.asObservable();

  private readonly _progressEvent$ = new Subject<ProgressEvent<FileReader>>();

  readonly progressEvent$ = this._progressEvent$.asObservable();

  private readonly _readyState$ = new BehaviorSubject<
    typeof FileReader.prototype.readyState
  >(0);

  readonly readyState$ = merge(
    of(null),
    this._readyState$,
    this.loadEndEvent$
  ).pipe(
    map(() => this._fileReader.readyState),
    distinctUntilChanged(),
    shareReplay(1)
  );

  readonly isReady$ = this.readyState$.pipe(
    map(() => this._fileReader.readyState == 2),
    distinctUntilChanged(),
    shareReplay(1)
  );

  readonly result$ = of(null).pipe(
    tap(() => setTimeout(() => this.invoker(this.blob), 5)),
    switchMap(() =>
      this.isReady$.pipe(
        filter((e) => e),
        map(() => this.map(this._fileReader.result) as R)
      )
    ),
    shareReplay(1)
  );

  private readonly _subscriptions = merge(
    this.loadEndEvent$.pipe(tap(() => this._readyState$.complete())),
    merge(this.abortEvent$, this.errorEvent$).pipe(
      tap(() =>
        [
          this._abortEvent$,
          this._error$,
          this._errorEvent$,
          this._loadEndEvent$,
          this._loadEvent$,
          this._loadStartEvent$,
          this._progressEvent$,
          this._readyState$,
        ].forEach((observable) => observable.complete())
      )
    )
  ).subscribe();
}

export class ObservableArrayBufferFromFileReader<
  T extends Blob = Blob
> extends AbstractObservableFileReader<T, ArrayBuffer> {
  invoker(source: T) {
    this._fileReader.readAsArrayBuffer(source);
  }
}

export class ObservableTextFromFileReader<
  T extends Blob = Blob
> extends AbstractObservableFileReader<T, string> {
  invoker(source: T) {
    this._fileReader.readAsText(source);
  }
}

export class ObservableDataURLFromFileReader<
  T extends Blob = Blob
> extends AbstractObservableFileReader<T, DataURL> {
  invoker(source: T) {
    this._fileReader.readAsDataURL(source);
  }

  map(source: any) {
    return new DataURLImpl(source);
  }
}
