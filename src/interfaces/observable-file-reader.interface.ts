import { Observable } from "rxjs";

export interface DataURL {
  readonly mime: string;
  readonly content: string;
}

export interface ObservableFileReader<
  T extends Blob = Blob,
  R = string | ArrayBuffer | DataURL
> {
  readonly blob: T;
  readonly error$: Observable<typeof FileReader.prototype.error>;
  readonly readyState$: Observable<typeof FileReader.prototype.readyState>;
  readonly result$: Observable<R>;
  readonly abortEvent$: Observable<ProgressEvent<FileReader>>;
  readonly errorEvent$: Observable<ProgressEvent<FileReader>>;
  readonly loadEvent$: Observable<ProgressEvent<FileReader>>;
  readonly loadEndEvent$: Observable<ProgressEvent<FileReader>>;
  readonly loadStartEvent$: Observable<ProgressEvent<FileReader>>;
  readonly progressEvent$: Observable<ProgressEvent<FileReader>>;
  readonly isReady$: Observable<boolean>;
}
