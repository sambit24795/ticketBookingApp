import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSesson from "cookie-session";

import { createChargeRouter } from "./routes/new";

import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@samtibook/common/build";


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

app.use(createChargeRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
