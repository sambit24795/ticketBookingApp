import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@samtibook/common/build";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
