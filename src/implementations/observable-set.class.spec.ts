import { first, firstValueFrom, map, take, toArray } from "rxjs";
import { ObservableSetImpl } from "./observable-set.class";

const listOfArguments = [[], [1], [1, 2], [1, 2, 3]];

describe(`Test of ${ObservableSetImpl.name}`, () => {
  describe("it must instantiates:", () => {
    it(`with new and no arguments`, () =>
      expect(new ObservableSetImpl()).not.toBeNull());

    it(`by static method and no arguments`, () =>
      expect(ObservableSetImpl.of()).not.toBeNull());

    for (let args of listOfArguments) {
      it(`with new and these arguments: '${args}'`, () =>
        expect(new ObservableSetImpl(args)).not.toBeNull());

      it(`by static method and these arguments: '${args}'`, () =>
        expect(ObservableSetImpl.of(args)).not.toBeNull());
    }
  });

  describe("with these values:", () => {
    for (let args of listOfArguments) {
      describe(`'${args}',`, () => {
        let observableSetImpl: ObservableSetImpl<number>;
        beforeEach(() => (observableSetImpl = ObservableSetImpl.of(args)));

        it(`must have them`, () => {
          const setValues = [...observableSetImpl];
          expect(args.every((e) => setValues.includes(e))).toBeTruthy();
        });

        it(`must its property, 'values$', emits them`, () => {
          observableSetImpl.values$
            .pipe(first())
            .subscribe((values) =>
              expect(args.every((e) => values.includes(e))).toBeTruthy()
            );
        });
      });
    }
  });

  describe("method testing:", () => {
    for (let args of listOfArguments) {
      let observableSetImpl: ObservableSetImpl<number>;
      beforeEach(() => (observableSetImpl = ObservableSetImpl.of()));

      describe(`when invoking 'add' method, with these args: ${args}`, () => {
        let allAddPromise: Promise<number[]>;
        let valuePromise: Promise<number[][]>;
        let changePromise: Promise<Array<typeof observableSetImpl>>;

        beforeEach(() => {
          const { add$, values$, change$ } = observableSetImpl;

          allAddPromise = firstValueFrom(
            add$.pipe(take(args.length), toArray())
          );

          valuePromise = firstValueFrom(
            values$.pipe(take(args.length), toArray())
          );

          changePromise = firstValueFrom(
            change$.pipe(take(args.length), toArray())
          );

          args.forEach((e) => observableSetImpl.add(e));
        });

        it(`must emit all by the property 'add$'`, () => {
          return expect(allAddPromise).resolves.toEqual(args);
        });

        it("must have all them as values", () => {
          const values = [...observableSetImpl];
          expect(args.every((e) => values.includes(e)));
        });

        it(`must its property 'value$' emits ${args.length} time(s)`, () => {
          return expect(valuePromise).resolves.toHaveLength(args.length);
        });

        it(`must its property 'change$' emits ${args.length} time(s)`, () => {
          return expect(changePromise).resolves.toHaveLength(args.length);
        });

        it(`must its property 'change$' emits all instance values`, () => {
          return expect(
            changePromise.then((instances) =>
              instances.every((e) => e instanceof ObservableSetImpl)
            )
          ).resolves.toBeTruthy();
        });
      });

      describe(`when invoking 'addAll' method, with these args: ${args}`, () => {
        let allAddPromise: Promise<number[]>;
        let addAllPromise: Promise<number[]>;

        beforeEach(() => {
          const { add$, addAll$ } = observableSetImpl;

          allAddPromise = firstValueFrom(
            add$.pipe(take(args.length), toArray())
          );

          addAllPromise = firstValueFrom(
            addAll$.pipe(map((e) => Array.from(e)))
          );

          observableSetImpl.addAll(...args);
        });

        it(`must emit all by the property 'addAll$'`, () => {
          return expect(addAllPromise).resolves.toEqual(args);
        });

        it(`must emit all by the property 'add$'`, () => {
          return expect(allAddPromise).resolves.toEqual(args);
        });
      });

      for (let initializingValues of [args, [0, ...args]]) {
        describe(`when invoking 'delete' method, with these args: ${args}`, () => {
          let allDeletePromise: Promise<number[]>;
          let valuePromise: Promise<number[][]>;
          let changePromise: Promise<Array<typeof observableSetImpl>>;

          beforeEach(() => {
            observableSetImpl = ObservableSetImpl.of(initializingValues);

            const { delete$, values$, change$ } = observableSetImpl;

            allDeletePromise = firstValueFrom(
              delete$.pipe(take(args.length), toArray())
            );

            valuePromise = firstValueFrom(
              values$.pipe(take(args.length), toArray())
            );

            changePromise = firstValueFrom(
              change$.pipe(take(args.length), toArray())
            );

            args.forEach((e) => observableSetImpl.delete(e));
          });

          it(`must emit all by the property 'remove$'`, () => {
            return expect(allDeletePromise).resolves.toEqual(args);
          });

          it(`must not have these values: ${args}`, () => {
            const values = [...observableSetImpl];
            expect(args.every((e) => !values.includes(e)));
          });

          it(`must its property 'value$' emits ${args.length} time(s)`, () => {
            return expect(valuePromise).resolves.toHaveLength(args.length);
          });

          it(`must its property 'change$' emits ${args.length} time(s)`, () => {
            return expect(changePromise).resolves.toHaveLength(args.length);
          });

          it(`must its property 'change$' emits all instance values`, () => {
            return expect(
              changePromise.then((instances) =>
                instances.every((e) => e instanceof ObservableSetImpl)
              )
            ).resolves.toBeTruthy();
          });
        });

        describe(`when invoking 'deleteAll' method, with these args: ${args}`, () => {
          let allDeletePromise: Promise<number[]>;
          let deleteAllPromise: Promise<number[]>;

          beforeEach(() => {
            observableSetImpl = ObservableSetImpl.of(initializingValues);

            const { delete$, deleteAll$ } = observableSetImpl;

            allDeletePromise = firstValueFrom(
              delete$.pipe(take(args.length), toArray())
            );

            deleteAllPromise = firstValueFrom(
              deleteAll$.pipe(map((e) => Array.from(e)))
            );

            observableSetImpl.deleteAll(...args);
          });

          it(`must emit all by the property 'deleteAll$'`, () => {
            return expect(deleteAllPromise).resolves.toEqual(args);
          });

          it(`must emit all by the property 'delete$'`, () => {
            return expect(allDeletePromise).resolves.toEqual(args);
          });
        });
      }
    }
  });
});
