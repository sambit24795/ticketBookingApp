import { TicketCreatedEvent } from "@samtibook/common/build";
import mongoose from 'mongoose';
import { Message } from "node-nats-streaming";

import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    const listener = new TicketCreatedListener(natsWrapper.client);

    const data: TicketCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: 'qwerty',
        price: 10,
        userId: mongoose.Types.ObjectId().toHexString()
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

 it('creates and saves a ticket', async () => {
    const { data, listener, msg } = await setup();

    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket?.price).toEqual(data.price);
    expect(ticket?.title).toEqual(data.title);
});

it('acks the message', async () => {
    const { data, msg, listener } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});