import { ClientEvents, ServerEvents } from "shared/dist/events";
import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import { Song } from "shared/dist/karaoke";
import { getKaraokePlaylist } from "./repository/catalog.repository";

export function setupSockets(
  httpServer: HttpServer,
  serverOptions: Partial<ServerOptions> = {}
): Server<ClientEvents, ServerEvents> {
  const io = new Server<ClientEvents, ServerEvents>(httpServer, serverOptions);

  let isKaraokeLive = false;
  let playlist: Song[] = [];
  let queue: Song[] = [];
  // Broadcast new state to all clients
  const emitKaraokeState = () => {
    io.emit("karaoke:state", { isKaraokeLive, playlist, queue });
  };
  io.on("connection", (socket) => {
    console.log("new connection with ID:", socket.id);
    console.log("state", isKaraokeLive, playlist, queue);
    socket.emit("karaoke:state", { isKaraokeLive, playlist, queue });

    socket.on("karaoke:start", () => {
      if (!isKaraokeLive) {
        console.log("START");
        playlist = getKaraokePlaylist();
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
        playlist.length = 0;
        playlist.push({ id: 1, artist: "Radiohead", title: "Lucky" });
        playlist.push({ id: 2, artist: "Rolling Stones", title: "Angel" });

        emitKaraokeState();
        console.log("Karaoke stopped by:", socket.id);
      }
    });

    socket.on("song:chosen", (song: Song) => {
      if (isKaraokeLive) {
        const songIndex = playlist.findIndex(
          (elem) => elem.artist === song.artist && elem.title === song.title
        );
        if (songIndex >= 0) {
          playlist.splice(songIndex, 1);
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
