import React from "react";
import { SongList, SongListItem } from "../components/SongList";
import { Song } from "shared/dist/karaoke";
import io from "socket.io-client";

const socket = io("localhost:3000");
export const Live = () => {
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

  return isConnected ? (
    <div className="flex flex-col">
      <div>
        {isKaraokeLive
          ? "Karaoke is live!"
          : "Karaoke will start any minute now!"}
      </div>
      <div>
        <SongList>
          {queue.map((song: Song) => (
            <SongListItem
              key={`${song.artist}-${song.title}`}
              artist={song.artist}
              title={song.title}
            />
          ))}
        </SongList>
      </div>
      <div>
        <SongList>
          {setList.map((song: Song) => (
            <SongListItem
              onClick={() => {
                if (isKaraokeLive) {
                  socket.emit("song:chosen", song);
                }
              }}
              key={`${song.artist}-${song.title}`}
              artist={song.artist}
              title={song.title}
            />
          ))}
        </SongList>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};
