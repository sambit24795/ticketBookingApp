import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@samtibook/common/build";

export class OrdercancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
