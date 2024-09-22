import { ObservableMapImpl } from "../../dist/implementations/observable-map.class";
import { ObservableSetImpl } from "./observable-set.class";

const listOfArguments = [
  [],
  [
    [0, "a"],
    [1, "b"],
  ],
];

describe(`Test of ${ObservableMapImpl.name}`, () => {
  describe("it must instantiates: ", () => {
    it("with new and no arguments ", () =>
      expect(new ObservableMapImpl()).not.toBeNull());

    it(`by static method and no arguments `, () =>
      expect(ObservableSetImpl.of()).not.toBeNull());

    for (let args of listOfArguments) {
      it(`with new and these arguments: '${args}'`, () =>
        expect(new ObservableSetImpl(args)).not.toBeNull());

      it(`by static method and these arguments: '${args}'`, () =>
        expect(ObservableSetImpl.of(args)).not.toBeNull());
    }
  });
});
