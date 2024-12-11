import React from "react";
import { Song } from "shared/dist/karaoke";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export const useKaraoke = () => {
  const [isConnected, setIsConnected] = React.useState<boolean>(
    socket.connected
  );
  const [isKaraokeLive, setIsKaraokeLive] = React.useState<boolean>(false);
  const [setList, setSetlist] = React.useState<Song[]>([]);
  const [queue, setQueue] = React.useState<Song[]>([]);

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
      console.log(state);
      setIsKaraokeLive(state.isKaraokeLive);
      setSetlist(state.setList);
      setQueue(state.queue);
    });

    return () => {
      socket.off("karaoke:state");
    };
  }, []);
  return { isConnected, isKaraokeLive, setList, queue, socket };
};
