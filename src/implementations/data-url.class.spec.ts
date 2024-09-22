import { DataURLImpl } from "./data-url.class";

const mime = "text/plain";
const content = "VGV4dCBmaWxlIGNvbnRlbnQ=";
const finalString = `data:${mime};base64,${content}`;
const argsList = [[mime, content], [finalString]];

describe(`Test of '${DataURLImpl.name}': `, () => {
  for (const args of argsList) {
    let instance!: DataURLImpl;

    beforeEach(() => {
      const func = DataURLImpl.of as any;
      instance = func.apply(null, args);
    });

    it(`it must return an instance '${DataURLImpl.of.name}': `, () =>
      expect(instance).toBeTruthy());

    it(`the mime must be equal to '${mime}'`, () =>
      expect(mime).toEqual(instance.mime));

    it(`the content must be equal to '${content}'`, () =>
      expect(content).toEqual(instance.content));

    it(`the string must be equal to '${finalString}'`, () =>
      expect(finalString).toEqual(instance.toString()));
  }

  it(`the mime should be an empty string`, () =>
    expect(DataURLImpl.of("", content).mime).toEqual(""));

  it(`the mime should be an empty string`, () =>
    expect(DataURLImpl.of(`data:;base64,${content}`).mime).toEqual(""));
});
