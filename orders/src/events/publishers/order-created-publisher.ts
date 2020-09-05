import { OrderCreatedEvent, Publisher, Subjects } from "@samtibook/common/build";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}