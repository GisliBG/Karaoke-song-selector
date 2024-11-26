import { ClientEvents, ServerEvents } from "shared/dist/events";
import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
//import { TodoRepository } from "./todo-management/todo.repository";
//import createTodoHandlers from "./todo-management/todo.handlers";

export interface Components {
  //   todoRepository: TodoRepository;
}

export function createApplication(
  httpServer: HttpServer,
  components: Components,
  serverOptions: Partial<ServerOptions> = {}
): Server<ClientEvents, ServerEvents> {
  const io = new Server<ClientEvents, ServerEvents>(httpServer, serverOptions);

  // const { createTodo, readTodo, updateTodo, deleteTodo, listTodo } =
  //   createTodoHandlers(components);

  io.on("connection", (socket) => {
    let isKaraokeLive = false;
    console.log("new connection with ID:", socket.id);

    socket.emit("karaoke:state", isKaraokeLive);

    socket.on("karaoke:start", () => {
      if (!isKaraokeLive) {
        console.log("START");
        isKaraokeLive = true;
        io.emit("karaoke:state", isKaraokeLive); // Broadcast new state to all clients
        console.log("Karaoke started by:", socket.id);
      }
    });

    socket.on("karaoke:stop", () => {
      if (isKaraokeLive) {
        isKaraokeLive = false;
        io.emit("karaoke:state", isKaraokeLive); // Broadcast new state to all clients
        console.log("Karaoke stopped by:", socket.id);
      }
    });

    // socket.on("songPicked", (songId) => {
    //   if (karaokeIsLive) {
    //     const songIndex = setList.findIndex((item) => item.id === songId);
    //     if (songIndex >= 0) {
    //       queue.push(setList[songIndex]);
    //       setList.splice(songIndex, 1);
    //       socket.emit("karaokeState", { karaokeIsLive, setList, queue });
    //     }
    //   }
    // });
    // socket.on("todo:create", createTodo);
    // socket.on("todo:read", readTodo);
    // socket.on("todo:update", updateTodo);
    // socket.on("todo:delete", deleteTodo);
    // socket.on("todo:list", listTodo);
  });

  return io;
}
