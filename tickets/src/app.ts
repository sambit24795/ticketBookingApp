import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSesson from "cookie-session";

import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@samtibook/common/build";

import { createTicketRouter } from "./routes/new";
import { showTicketrouter } from "./routes/show";
import { indexTicketRouter } from "./routes/index";
import { updateTicketRouter } from "./routes/update";

const app = express();

app.use(json());
app.set("trust proxy", true);
app.use(
  cookieSesson({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketrouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
