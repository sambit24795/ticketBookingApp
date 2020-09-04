import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSesson from "cookie-session";

import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@samtibook/common/build";

import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes/index";
import { deleteOrderRouter } from "./routes/delete";

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

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
