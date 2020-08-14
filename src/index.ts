import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import { createConnection } from "typeorm";

import routes from "./routes";
dotenv.config();

createConnection()
  .then(async (_conn) => {
    const app = express();

    // Use libraries middleware
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(morgan("tiny"));

    app.use("/", routes);

    app.listen(process.env.PORT, () => {
      console.log(`The server is live on port ${process.env.PORT}.`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
