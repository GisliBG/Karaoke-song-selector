import { Fragment, useState } from "react";
import { SongList, SongListItem } from "../components/SongList";
import { Song } from "shared/dist/karaoke";
import { useKaraoke } from "../hooks/useKaraoke";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export const Live = () => {
  const { isConnected, isKaraokeLive, playlist, queue, socket, session } =
    useKaraoke();
  const [userName, setUserName] = useState<string>(session?.userName ?? "");

  return isConnected ? (
    <div className='flex flex-col justify-center min-h-[256px]'>
      {!session?.userName ? (
        <div className='flex flex-col justify-center items-center gap-4 max-w-[256px]'>
          <Input
            type='text'
            placeholder='Please enter your name'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <Button
            onClick={() => {
              socket.emit("session:username", userName);
            }}
          >
            Submit
          </Button>
        </div>
      ) : (
        <Fragment>
          <div>
            {isKaraokeLive
              ? "Karaoke is live!"
              : "Karaoke will start any minute now!"}
          </div>
          <div>
            <SongList>
              {queue.map((song) => (
                <SongListItem
                  highlight={song.id === session?.songId}
                  key={`${song.artist}-${song.title}`}
                  artist={song.artist}
                  title={song.title}
                  options={<div>{song.userName}</div>}
                />
              ))}
            </SongList>
          </div>
          <div className='flex gap-2'>
            <div>{session.userName.toString()}</div>
            <Button
              disabled={session?.songId === undefined}
              onClick={() => {
                const songToCancel = queue.find(
                  (elem) => elem.id == session?.songId
                );

                if (songToCancel) {
                  socket.emit("song:cancel", songToCancel);
                }
              }}
            >
              Chicken out!
            </Button>
          </div>
          <div>
            <SongList>
              {playlist.map((song: Song) => (
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
        </Fragment>
      )}
    </div>
  ) : (
    <div>Loading...</div>
  );
};
