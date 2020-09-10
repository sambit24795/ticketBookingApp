import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
  OrderStatus,
} from "@samtibook/common/build";
import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrdercancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationcompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage({ orderId }: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new Error("order not found!");
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    await new OrdercancelledPublisher(this.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });

    msg.ack();
  }
}
