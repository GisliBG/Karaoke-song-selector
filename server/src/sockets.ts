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
  sessionMiddleware: RequestHandler | any
): Server<ClientEvents, ServerEvents> {
  const io = new Server<ClientEvents, ServerEvents>(httpServer, serverOptions);
  io.engine.use(sessionMiddleware);
  let isKaraokeLive = false;
  let playlist: Song[] = [];
  let queue: Song[] = [];
  // Broadcast new state to all clients
  const emitKaraokeState = () => {
    io.emit("karaoke:state", { isKaraokeLive, playlist, queue });
  };
  const emitSessionData = (
    sessionId: string,
    user: { id: string; songId?: number }
  ) => {
    io.to(sessionId).emit("session-data", user);
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
    emitSessionData(req.session.id, req.session.user);
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
        if (req.session.user) {
          req.session.user.songId = undefined;
          req.session.save(() => {
            console.log("STOP");
            isKaraokeLive = false;
            queue.length = 0;
            playlist.length = 0;

            emitKaraokeState();

            console.log("Karaoke stopped by:", socket.id);
          });
        }
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
                (elem) => elem.id == song.id
              );
              if (songIndex >= 0) {
                playlist.splice(songIndex, 1);
                queue.push(song);
                emitKaraokeState();
                emitSessionData(req.session.id, req.session.user!);
              }
            });
          }
        });
      }
    });

    socket.on("song:cancel", (song: Song) => {
      if (isKaraokeLive) {
        req.session.reload((err) => {
          if (err) {
            return socket.disconnect();
          }
          if (req.session.user) {
            req.session.user = { ...req.session.user, songId: undefined };
            req.session.save(() => {
              const songIndex = queue.findIndex((elem) => elem.id == song.id);
              if (songIndex >= 0) {
                queue.splice(songIndex, 1);
                playlist.push(song);
                emitKaraokeState();
                emitSessionData(req.session.id, req.session.user!);
              }
            });
          }
        });
      }
    });

    socket.on("song:next", () => {
      if (isKaraokeLive) {
        req.session.reload((err) => {
          if (err) {
            return socket.disconnect();
          }
          if (req.session.user) {
            req.session.user = { ...req.session.user, songId: undefined };
            req.session.save(() => {
              queue.shift();
              emitKaraokeState();
              emitSessionData(req.session.id, req.session.user!);
            });
          }
        });
      }
    });
  });

  return io;
}
