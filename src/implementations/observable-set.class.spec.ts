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

      describe(`when invoking 'clear' method`, () => {
        let clearPromise: Promise<typeof observableSetImpl>;

        beforeEach(() => {
          clearPromise = firstValueFrom(observableSetImpl.clear$);

          observableSetImpl.addAll(...args);

          observableSetImpl.clear();
        });

        it(`must emit 'this' by the property 'clear$'`, () => {
          return expect(clearPromise).resolves.toEqual(observableSetImpl);
        });
      });

      describe(`when invoking 'deleteDifference' method`, () => {
        let deleteAllPromise: Promise<Iterable<number>>;
        const remainingValues = args.map((e, i) => (i + 1) * 100);

        beforeEach(() => {
          deleteAllPromise = firstValueFrom(observableSetImpl.deleteAll$);

          observableSetImpl.addAll(...args, ...remainingValues);

          observableSetImpl.deleteDifference(...remainingValues);
        });

        it(`must emit '${remainingValues}' by the property 'deleteAll$'`, () => {
          expect(deleteAllPromise).resolves.toEqual(args);
          expect([...observableSetImpl]).toEqual(remainingValues);
        });
      });

      describe(`when invoking 'resetTo' method`, () => {
        let deleteAllPromise: Promise<Iterable<number>>;
        let addAllPromise: Promise<Iterable<number>>;
        let methodReturn: typeof observableSetImpl;

        const remainingValues = args.map((e, i) => (i + 1) * 100);

        beforeEach(() => {
          deleteAllPromise = firstValueFrom(observableSetImpl.deleteAll$);

          addAllPromise = firstValueFrom(observableSetImpl.addAll$);

          observableSetImpl.addAll(...args);

          methodReturn = observableSetImpl.resetTo(...remainingValues);
        });

        it(`must emit '${args}' by the property 'deleteAll$'`, () => {
          expect(deleteAllPromise).resolves.toEqual(args);
          expect(methodReturn).toEqual(observableSetImpl);
        });

        it(`must emit '${remainingValues}' by the property 'addAll$'`, () => {
          expect(addAllPromise).resolves.toEqual(args);
          expect([...observableSetImpl]).toEqual(remainingValues);
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

    for (let params of [
      {
        get initializationValues() {
          return [...this.remainingValues, ...this.methodArguments];
        },
        remainingValues: [1, 2],
        methodArguments: [3, 4, 5],
      },
    ]) {
      let observableSetImpl: ObservableSetImpl<number>;

      beforeEach(() => {
        observableSetImpl = new ObservableSetImpl(params.initializationValues);
      });

      describe(`when invoking 'difference' method, with these initialization values: ${params.initializationValues}`, () => {
        let methodReturn: typeof observableSetImpl;

        beforeEach(() => {
          methodReturn = observableSetImpl.difference(
            new Set(params.methodArguments)
          );
        });

        it(`must return a new ObservableSetImpl with these values:`, () => {
          expect(methodReturn).toBeInstanceOf(ObservableSetImpl);
          expect([...methodReturn]).toEqual(params.remainingValues);
        });
      });
    }

    for (let params of [
      {
        initializationValues: [1, 2, 3],
        get returnValues() {
          return this.initializationValues;
        },
        methodArguments: [1, 2, 3, 4, 5],
      },
    ]) {
      let observableSetImpl: ObservableSetImpl<number>;

      beforeEach(() => {
        observableSetImpl = new ObservableSetImpl(params.initializationValues);
      });

      describe(`when invoking 'intersection' method, with these initialization values: ${params.initializationValues}`, () => {
        let methodReturn: typeof observableSetImpl;

        beforeEach(() => {
          methodReturn = observableSetImpl.intersection(
            new Set(params.methodArguments)
          );
        });

        it(`must return a new ObservableSetImpl with these values:`, () => {
          expect(methodReturn).toBeInstanceOf(ObservableSetImpl);
          expect([...methodReturn]).toEqual(params.returnValues);
        });
      });
    }

    for (let params of [
      {
        initializationValues: [1, 2, 3],
        get returnValues() {
          return [...this.initializationValues, ...this.methodArguments];
        },
        methodArguments: [4, 5, 6],
      },
    ]) {
      let observableSetImpl: ObservableSetImpl<number>;

      beforeEach(() => {
        observableSetImpl = new ObservableSetImpl(params.initializationValues);
      });

      describe(`when invoking 'union' method, with these initialization values: ${params.initializationValues}`, () => {
        let methodReturn: typeof observableSetImpl;

        beforeEach(() => {
          methodReturn = observableSetImpl.union(
            new Set(params.methodArguments)
          );
        });

        it(`must return a new ObservableSetImpl with these values:`, () => {
          expect(methodReturn).toBeInstanceOf(ObservableSetImpl);
          expect([...methodReturn]).toEqual(params.returnValues);
        });
      });
    }

    for (let params of [
      {
        initializationValues: [1, 2, 3, 4],
        get returnValues() {
          return [
            ...this.initializationValues.filter(
              (e: number) => !this.methodArguments.includes(e)
            ),
            ...this.methodArguments.filter(
              (e: number) => !this.initializationValues.includes(e)
            ),
          ];
        },
        methodArguments: [4, 5, 6, 7, 8],
      },
    ]) {
      let observableSetImpl: ObservableSetImpl<number>;

      beforeEach(() => {
        observableSetImpl = new ObservableSetImpl(params.initializationValues);
      });

      describe(`when invoking 'symmetricDifference' method, with these initialization values: ${params.initializationValues}`, () => {
        let methodReturn: typeof observableSetImpl;

        beforeEach(() => {
          methodReturn = observableSetImpl.symmetricDifference(
            new Set(params.methodArguments)
          );
        });

        it(`must return a new ObservableSetImpl with these values:`, () => {
          expect(methodReturn).toBeInstanceOf(ObservableSetImpl);
          expect([...methodReturn]).toEqual(params.returnValues);
        });
      });
    }

    for (let params of [
      {
        initializationValues: [1, 2, 3, 4, 5, 6, 7, 8],
        methodArgument: (e: number) => e % 2 == 1,
      },
    ]) {
      let observableSetImpl: ObservableSetImpl<number>;

      beforeEach(() => {
        observableSetImpl = new ObservableSetImpl(params.initializationValues);
      });

      describe(`when invoking 'filter' method, with these initialization values: ${params.initializationValues}`, () => {
        let methodReturn: typeof observableSetImpl;

        beforeEach(() => {
          methodReturn = observableSetImpl.filter(params.methodArgument);
        });

        it(`must return a new ObservableSetImpl with these values:`, () => {
          expect(methodReturn).toBeInstanceOf(ObservableSetImpl);
          expect([...methodReturn]).toEqual(
            params.initializationValues.filter(params.methodArgument)
          );
        });
      });
    }
  });
});
