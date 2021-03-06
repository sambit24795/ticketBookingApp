import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from '../../nats-wrapper';

it("returns an error if ticket does not exist", async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId,
    })
    .expect(404);
});

it("returns an error if ticket is already reserved", async () => {
  const ticket = Ticket.build({
    title: "qwerty",
    price: 20,
    id: mongoose.Types.ObjectId().toHexString()
  });
  await ticket.save();

  const order = Order.build({
    userId: "12e2d2332r3",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    title: "qwerty",
    price: 20,
    id: mongoose.Types.ObjectId().toHexString()
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

it('emits an order created event', async () => {
  const ticket = Ticket.build({
    title: "qwerty",
    price: 20,
    id: mongoose.Types.ObjectId().toHexString()
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
