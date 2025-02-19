import { ClientEvents, ServerEvents } from "shared/dist/events";
import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import { Song, QueueSong } from "shared/dist/karaoke";
import { getKaraokePlaylist } from "./repository/catalog.repository";
import { type Request, type RequestHandler } from "express";
import { generateId } from "./utils";

declare module "express-session" {
  interface SessionData {
    user: { id: string; songId?: number; userName?: string; admin?: boolean };
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
  let queue: QueueSong[] = [];
  // Broadcast new state to all clients
  const emitKaraokeState = () => {
    io.emit("karaoke:state", { isKaraokeLive, playlist, queue });
  };
  const emitSessionData = (
    sessionId: string,
    user: { id: string; songId?: number; userName?: string }
  ) => {
    io.to(sessionId).emit("session:data", user);
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
        playlist = getKaraokePlaylist();
        isKaraokeLive = true;
        emitKaraokeState();
        console.log("Karaoke started by:", socket.id);
      }
    });

    socket.on("karaoke:stop", () => {
      if (isKaraokeLive) {
        saveSessionChange(
          req,
          () => {
            isKaraokeLive = false;
            queue.length = 0;
            playlist.length = 0;

            emitKaraokeState();
            io.sockets.sockets.forEach((s) => {
              const sReq = s.request as Request;
              if (sReq.session.user && sReq.session.user.songId) {
                sReq.session.user.songId = undefined;
                saveSessionChange(
                  sReq,
                  () => {
                    emitSessionData(sReq.session.id, sReq.session.user!);
                  },
                  sReq.session.user
                );
              }
            });

            console.log("Karaoke stopped by:", socket.id);
          },
          { songId: undefined }
        );
      }
    });

    socket.on("song:chosen", (song: Song) => {
      if (isKaraokeLive) {
        if (req.session.user) {
          saveSessionChange(
            req,
            () => {
              const songIndex = playlist.findIndex(
                (elem) => elem.id == song.id
              );
              if (songIndex >= 0) {
                playlist.splice(songIndex, 1);
                queue.push({
                  ...song,
                  userName: req.session.user?.userName!,
                });
                emitKaraokeState();

                emitSessionData(req.session.id, req.session.user!);
              }
            },
            { songId: song.id }
          );
        }
      }
    });

    socket.on("song:cancel", (song: Song) => {
      if (isKaraokeLive) {
        saveSessionChange(
          req,
          () => {
            const songIndex = queue.findIndex((elem) => elem.id == song.id);
            if (songIndex >= 0) {
              queue.splice(songIndex, 1);
              playlist.push(song);
              emitKaraokeState();
              emitSessionData(req.session.id, req.session.user!);
            }
          },
          { songId: undefined }
        );
      }
    });

    socket.on("song:next", () => {
      if (isKaraokeLive) {
        saveSessionChange(
          req,
          () => {
            queue.shift();
            emitKaraokeState();
            emitSessionData(req.session.id, req.session.user!);
          },
          { songId: undefined }
        );
      }
    });

    socket.on("session:username", (userName: string) => {
      if (userName.length > 2) {
        req.session.reload((err) => {
          if (err) {
            return socket.disconnect();
          }
          if (req.session.user) {
            req.session.user = { ...req.session.user, userName };
            req.session.save(() => {
              emitSessionData(req.session.id, req.session.user!);
            });
          }
        });
      }
    });

    const saveSessionChange = (
      req: Request,
      cb: () => void,
      user: Partial<{ id: string; songId?: number; userName?: string }>
    ) => {
      req.session.reload((err) => {
        if (err) {
          return socket.disconnect();
        }
        if (req.session.user) {
          if (
            (req.session.user.songId && !user.songId) ||
            (!req.session.user.songId && user.songId)
          ) {
            req.session.user = { ...req.session.user, ...user };
            req.session.save(() => {
              cb();
            });
          }
        }
      });
    };
  });

  return io;
}
