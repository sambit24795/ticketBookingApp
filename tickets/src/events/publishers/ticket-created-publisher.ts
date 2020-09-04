import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@samtibook/common/build";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
