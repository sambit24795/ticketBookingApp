import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@samtibook/common/build";
import { Message } from "node-nats-streaming";

import { TicketUpdatedListner } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  const listener = new TicketUpdatedListner(natsWrapper.client);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "qwerty",
    price: 20,
  });
  await ticket.save();

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "asdfg",
    price: 300,
    userId: "fdgdhjdcdcd",
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, ticket, listener };
};

it("finds, updates and saves ticket", async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.title).toEqual(data.title);
  expect(updatedTicket?.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event is in future", async () => {
  const { msg, data, ticket, listener } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
