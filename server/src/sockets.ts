import { ClientEvents, ServerEvents } from "shared/dist/events";
import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import { Song } from "shared/dist/karaoke";
import { getKaraokePlaylist } from "./repository/catalog.repository";
import { type Request, type RequestHandler } from "express";
import { generateId } from "./utils";

declare module "express-session" {
  interface SessionData {
    user: { id: string; songId?: number };
  }
}

export function setupSockets(
  httpServer: HttpServer,
  serverOptions: Partial<ServerOptions> = {},
  session: RequestHandler | any
): Server<ClientEvents, ServerEvents> {
  const io = new Server<ClientEvents, ServerEvents>(httpServer, serverOptions);
  io.engine.use(session);
  let isKaraokeLive = false;
  let playlist: Song[] = [];
  let queue: Song[] = [];
  // Broadcast new state to all clients
  const emitKaraokeState = () => {
    io.emit("karaoke:state", { isKaraokeLive, playlist, queue });
  };
  io.on("connection", (socket) => {
    const req = socket.request as Request;
    socket.join(req.session.id);
    if (!req.session.user) {
      req.session.user = { id: generateId() };
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
        } else {
          console.log("Session saved:", req.session.user);
        }
      });
    }
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

        emitKaraokeState();
        console.log("Karaoke stopped by:", socket.id);
      }
    });

    socket.on("song:chosen", (song: Song) => {
      if (isKaraokeLive) {
        req.session.reload((err) => {
          if (err) {
            return socket.disconnect();
          }

          if (req.session.user && !req.session.user.songId) {
            req.session.user = { ...req.session.user, songId: song.id };
            req.session.save(() => {
              const songIndex = playlist.findIndex(
                (elem) =>
                  elem.artist === song.artist && elem.title === song.title
              );
              if (songIndex >= 0) {
                playlist.splice(songIndex, 1);
                queue.push(song);
                emitKaraokeState();
              }
            });
          }
        });
      }
    });

    socket.on("song:next", () => {
      queue.shift();
      emitKaraokeState();
    });
  });

  return io;
}
