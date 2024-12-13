import express from "express";
import bodyParser from "body-parser";
import { createServer } from "http";
import { setupSockets } from "./sockets";
import { getLocalIPAddress } from "./utils";
import { setupEndpoints } from "./endpoints";
import { setupSessionMiddleware } from "./sessions";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const httpServer = createServer(app);
const sessionMiddleware = setupSessionMiddleware();
app.use(sessionMiddleware);
app.use(bodyParser.json());
setupEndpoints(app);

setupSockets(
  httpServer,
  {
    cors: {
      origin: ["http://localhost:5173", `http://${getLocalIPAddress()}:5173`],
      credentials: true,
    },
  },
  sessionMiddleware
);

httpServer.listen(3000);

process.on("SIGINT", () => {
  console.log("Shutting down...");
  httpServer.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
