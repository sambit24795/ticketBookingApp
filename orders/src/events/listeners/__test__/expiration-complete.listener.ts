import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { ExpirationcompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { Order, OrderStatus } from "../../../models/order";
import { ExpirationCompleteEvent } from "@samtibook/common/build";

const setup = async () => {
  const listener = new ExpirationcompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "qwerty",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: "qwwe",
    expiresAt: new Date(),
    ticket: ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, msg, data };
};

it("updates the order status to cancelled", async () => {
  const { listener, order, msg, ticket, data } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it("emits an ordercancelled event", async () => {
  const { listener, order, msg, ticket, data } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it("acks the message", async () => {
  const { listener, order, msg, ticket, data } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
