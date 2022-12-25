import "reflect-metadata";
import dotenv from "dotenv";
import path from "path";
import express from "express";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import cors from "cors";

import MainRouter from "./routes";

const main = async () => {
  dotenv.config({ path: path.join(__dirname, "../.env") });

  await createConnection();

  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
  app.use("/", MainRouter);

  app.listen(process.env.PORT, () => {
    console.log(`Server started at PORT-[${process.env.PORT}]`);
  });
};

main();
