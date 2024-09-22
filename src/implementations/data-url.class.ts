import { Nillable } from "nullish-utils";
import { DataURL } from "../interfaces";

export class DataURLImpl implements DataURL {
  static of(mime: string, content: string): DataURL;
  static of(dataURL: string): DataURL;
  static of(mimeOrDataURL: string, content?: Nillable<string>): DataURL {
    return new DataURLImpl(mimeOrDataURL, content as any);
  }

  private _mime: Nillable<string>;
  private _content: Nillable<string>;
  private _dataURL: Nillable<string>;

  constructor(mime: string, content: string);
  constructor(dataURL: string);
  constructor(mimeOrDataURL: string, content?: Nillable<string>) {
    if (content) {
      this._mime = mimeOrDataURL;
      this._content = content;
    } else {
      this._dataURL = mimeOrDataURL;
    }

    Object.freeze(this);
  }

  get mime() {
    if (this._mime) return this._mime;
    if (!this._dataURL) return "";

    let mimeEndingIndex = this._dataURL!.indexOf(";");

    return this._dataURL!.substring(
      this._dataURL!.indexOf(":") + 1,
      mimeEndingIndex
    );
  }

  get content() {
    return (
      this._content ??
      this._dataURL!.substring(
        this._dataURL!.indexOf(",") + 1,
        this._dataURL!.length
      )
    );
  }

  toString() {
    return this._dataURL ?? `data:${this.mime};base64,${this.content}`;
  }
}
