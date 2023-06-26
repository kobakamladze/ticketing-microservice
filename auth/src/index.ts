import "express-async-errors";
import express from "express";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import usersRouter from "./routes/index";
import { errorHandler } from "./middlewares/error-handilng";
import { NotFoundError } from "./error/not-found-error";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use("/api/users", usersRouter);
app.use("*", () => {
  throw new NotFoundError();
});

// Error handler
app.use(errorHandler);

const start = async () => {
  // Enviromental variables check
  if (!process.env.JWT_KEY) throw new Error("ENV VARIABLE WAS NOT PROVIDED");

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("COnnected to DB...");
  } catch (e) {
    console.log(e);
  }

  app.listen(3000, () => console.log("Listening on PORT: 3000..."));
};

start();
