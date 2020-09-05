import {
  Listener,
  OrderCancelledEvent,
  Subjects,
} from "@samtibook/common/build";
import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedPublisher } from "../ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not Found");
    }

    ticket.set({ orderId: undefined });
    await ticket.save();

    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
    });

    msg.ack();
  }
}
