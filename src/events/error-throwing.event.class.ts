import { EventChaining } from "../event-chaining.class";

export class ErrorThrowingEvent<
  Er extends Error = Error,
  S extends object = object,
  E extends Event = Event
> extends EventChaining<{
  error: Er;
  scope: S;
  triggerEvents?: E[];
}> {}
