import { isNil } from "nullish-utils";

export class EventChaining<
  D extends { triggerEvents?: readonly E[] },
  E extends Event = Event
> extends CustomEvent<D> {
  static isAParentTrigger<
    T extends EventChaining<any> = EventChaining<any>,
    E extends Event = Event
  >(eventChaining: T, event: E): boolean {
    if (
      isNil(eventChaining) ||
      isNil(event) ||
      !(eventChaining instanceof EventChaining)
    )
      return false;

    const { triggerEvents } = eventChaining;

    return (
      triggerEvents?.includes(event) ||
      triggerEvents?.some((initialEvent) =>
        this.isAParentTrigger(<any>initialEvent, event)
      ) ||
      false
    );
  }

  static isAParentTriggerType<
    T extends EventChaining<any>,
    E extends typeof Event
  >(eventChaining: T, event: E): boolean {
    const { triggerEvents } = eventChaining;

    return (
      triggerEvents?.some((initialEvent) => initialEvent instanceof event) ||
      triggerEvents?.some((initialEvent) =>
        this.isAParentTriggerType(<any>initialEvent, event)
      ) ||
      false
    );
  }

  static of(params: any): any;
  static of<
    D extends { triggerEvents?: readonly E[] },
    E extends Event = Event
  >(params: D) {
    return new EventChaining(params);
  }

  readonly triggerEvents?: readonly E[];

  constructor(args: D) {
    super(new.target.name, {
      detail: args,
      bubbles: true,
    });

    Object.assign(this, args);
  }

  isAParentTrigger(event: Event) {
    return (<any>this.constructor).isAParentTrigger(this, event);
  }

  isAParentTriggerType<T extends typeof Event>(event: T) {
    return (<any>this.constructor).isAParentTriggerType(this, event);
  }
}
