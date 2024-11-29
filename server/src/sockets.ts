import { ClientEvents, ServerEvents } from "shared/dist/events";
import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import { Song } from "shared/dist/karaoke";

export function setupSockets(
  httpServer: HttpServer,
  serverOptions: Partial<ServerOptions> = {}
): Server<ClientEvents, ServerEvents> {
  const io = new Server<ClientEvents, ServerEvents>(httpServer, serverOptions);

  let isKaraokeLive = false;
  const setList: Song[] = [
    { id: 1, artist: "Radiohead", title: "Lucky" },
    { id: 2, artist: "Rolling Stones", title: "Angel" },
  ];
  const queue: Song[] = [];
  // Broadcast new state to all clients
  const emitKaraokeState = () => {
    io.emit("karaoke:state", { isKaraokeLive, setList, queue });
  };
  io.on("connection", (socket) => {
    console.log("new connection with ID:", socket.id);
    console.log("state", isKaraokeLive, setList, queue);
    socket.emit("karaoke:state", { isKaraokeLive, setList, queue });

    socket.on("karaoke:start", () => {
      if (!isKaraokeLive) {
        console.log("START");
        isKaraokeLive = true;
        emitKaraokeState();
        console.log("Karaoke started by:", socket.id);
      }
    });

    socket.on("karaoke:stop", () => {
      if (isKaraokeLive) {
        console.log("STOP");
        isKaraokeLive = false;
        queue.length = 0;
        setList.length = 0;
        setList.push({ id: 1, artist: "Radiohead", title: "Lucky" });
        setList.push({ id: 2, artist: "Rolling Stones", title: "Angel" });

        emitKaraokeState();
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
          emitKaraokeState();
        }
      }
    });

    socket.on("song:next", () => {
      queue.shift();
      emitKaraokeState();
    });
  });

  return io;
}
