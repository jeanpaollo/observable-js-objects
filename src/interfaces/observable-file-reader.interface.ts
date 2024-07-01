import { Observable } from "rxjs";

export interface ObservableFileReader<T extends Blob = Blob>
  extends FileReader {
  blob: T | undefined | null;
  readonly blob$: Observable<T | undefined | null>;
  readonly error$: Observable<typeof FileReader.prototype.error>;
  readonly readyState$: Observable<typeof FileReader.prototype.readyState>;
  readonly result$: Observable<typeof FileReader.prototype.result>;
  readonly abortEvent$: Observable<ProgressEvent>;
  readonly errorEvent$: Observable<ProgressEvent>;
  readonly loadEvent$: Observable<ProgressEvent>;
  readonly loadEndEvent$: Observable<ProgressEvent>;
  readonly loadStartEvent$: Observable<ProgressEvent>;
  readonly progressEvent$: Observable<ProgressEvent>;
  readonly arrayBuffer$: Observable<ArrayBuffer>;
  readonly dataURL$: Observable<string>;
  readonly binaryString$: Observable<string>;
  readonly text$: Observable<string>;
}
