import React from "react";
import { SessionUser } from "shared/dist/events";
import { QueueSong, Song } from "shared/dist/karaoke";
import io from "socket.io-client";

const socket = io("http://localhost:3000", { withCredentials: true });

export const useKaraoke = () => {
  const [isConnected, setIsConnected] = React.useState<boolean>(
    socket.connected
  );
  const [isKaraokeLive, setIsKaraokeLive] = React.useState<boolean>(false);
  const [playlist, setPlaylist] = React.useState<Song[]>([]);
  const [queue, setQueue] = React.useState<QueueSong[]>([]);
  const [session, setSession] = React.useState<SessionUser>();

  React.useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  React.useEffect(() => {
    socket.on("karaoke:state", (state) => {
      setIsKaraokeLive(state.isKaraokeLive);
      setPlaylist(state.playlist ?? []);
      setQueue(state.queue ?? []);
    });

    return () => {
      socket.off("karaoke:state");
    };
  }, []);

  React.useEffect(() => {
    socket.on("session:data", (session: SessionUser) => {
      console.log(session);
      setSession(session);
    });

    return () => {
      socket.off("session:data");
    };
  }, []);

  return { isConnected, isKaraokeLive, playlist, queue, socket, session };
};
