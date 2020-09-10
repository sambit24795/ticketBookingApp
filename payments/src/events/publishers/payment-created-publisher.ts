import { Publisher, PaymentCreatedEvent, Subjects } from "@samtibook/common/build";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}