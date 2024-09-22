import {
  ObservableArrayBufferFromFileReader,
  ObservableDataURLFromFileReader,
  ObservableTextFromFileReader,
} from "../../implementations/observable-file-reader.class";

export const toArrayBuffer = <T extends Blob = Blob>(blob: T) =>
  new ObservableArrayBufferFromFileReader(blob);

export const toText = <T extends Blob = Blob>(blob: T) =>
  new ObservableTextFromFileReader(blob);

export const toDataURL = <T extends Blob = Blob>(blob: T) =>
  new ObservableDataURLFromFileReader(blob);
