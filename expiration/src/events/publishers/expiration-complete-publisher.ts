import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@samtibook/common/build";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
