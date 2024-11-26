import { ClientEvents, ServerEvents } from "shared/dist/events";
import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import { Song } from "shared/dist/karaoke";
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

  let isKaraokeLive = false;
  const setList: Song[] = [
    { artist: "Radiohead", title: "Lucky" },
    { artist: "Rolling Stones", title: "Angel" },
  ];
  const queue: Song[] = [];
  io.on("connection", (socket) => {
    console.log("new connection with ID:", socket.id);
    console.log("state", isKaraokeLive, setList, queue);
    socket.emit("karaoke:state", { isKaraokeLive, setList, queue });

    socket.on("karaoke:start", () => {
      if (!isKaraokeLive) {
        console.log("START");
        isKaraokeLive = true;
        io.emit("karaoke:state", { isKaraokeLive, setList, queue }); // Broadcast new state to all clients
        console.log("Karaoke started by:", socket.id);
      }
    });

    socket.on("karaoke:stop", () => {
      if (isKaraokeLive) {
        console.log("STOP");
        isKaraokeLive = false;
        queue.length = 0;
        setList.length = 0;
        setList.push({ artist: "Radiohead", title: "Lucky" });
        setList.push({ artist: "Rolling Stones", title: "Angel" });

        io.emit("karaoke:state", { isKaraokeLive, setList, queue }); // Broadcast new state to all clients
        console.log("Karaoke stopped by:", socket.id);
      }
    });

    socket.on("song:chosen", (song: Song) => {
      if (isKaraokeLive) {
        const songIndex = setList.findIndex(
          (elem) => elem.artist === song.artist && elem.title === song.title
        );
        if (songIndex >= 0) {
          setList.splice(songIndex, 1);
          queue.push(song);
          io.emit("karaoke:state", { isKaraokeLive, setList, queue }); // Broadcast new state to all clients
        }
      }
    });

    socket.on("song:next", () => {
      queue.shift();
      io.emit("karaoke:state", { isKaraokeLive, setList, queue }); // Broadcast new state to all clients
    });
  });

  return io;
}
