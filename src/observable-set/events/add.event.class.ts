import { EventChaining } from "../../event-chaining.class";

export class AddEvent<
  T extends object = object,
  V extends object = object,
  E extends Event = Event
> extends EventChaining<{
  value: V;
  target: T;
  triggerEvents?: E[];
}> {}
