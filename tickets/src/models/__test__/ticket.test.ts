import { Ticket } from "../ticket";

it("implements Optimistic Concurrency Control", async (done) => {
  const ticket = Ticket.build({
    title: "qwerty",
    price: 5,
    userId: "123",
  });
  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance?.set({ price: 10 });
  secondInstance?.set({ price: 20 });

  await firstInstance?.save();

  try {
    await secondInstance?.save();
  } catch (err) {
    return done();
  }

  throw new Error("shouldn't reach here");
});

it("increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    price: 20,
    title: "qwerty",
    userId: "123",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);
});
