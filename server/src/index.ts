import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";
import { setupSockets } from "./sockets";
import { getLocalIPAddress } from "./utils";
import { setupEndpoints } from "./endpoints";

const app = express();
const httpServer = createServer(app);
app.use(bodyParser.json());

app.use(cors({ origin: "http://localhost:5173" }));

setupEndpoints(app);

setupSockets(
  httpServer,

  {
    cors: {
      origin: ["http://localhost:5173", `http://${getLocalIPAddress()}:5173`],
    },
  }
);

httpServer.listen(3000);
