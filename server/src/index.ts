/* eslint-disable no-console */
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { createContext } from "./context";
import { setupRedisClient } from "./redis";
import { router } from "./router";

dotenv.config();

const app = express();

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(morgan("combined"));

app.use(
  cors({
    origin: [process.env.ORIGIN ?? ""],
  })
);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router,
    createContext,
  })
);

setupRedisClient();

console.log("Server lisening on port 3000");
app.listen(3000);
