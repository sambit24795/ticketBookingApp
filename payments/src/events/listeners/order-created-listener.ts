import { OrderCreatedEvent, Listener, Subjects } from "@samtibook/common/build";
import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage({ id, status, userId, version, ticket: { price }}: OrderCreatedEvent['data'], msg: Message) {
        const order = Order.build({
            id,
            price,
            status,
            userId,
            version
        });
        await order.save();

        msg.ack();
    }
}