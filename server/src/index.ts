import express from "express";
import { createServer } from "http";
import { createApplication } from "./app";
// import { InMemoryTodoRepository } from "./todo-management/todo.repository";

const app = express();
app.use(express.json());
const httpServer = createServer(app);

createApplication(
  httpServer,
  {
    todoRepository: {},
  },
  {
    cors: {
      origin: ["http://localhost:5173"],
    },
  }
);

httpServer.listen(3000);
