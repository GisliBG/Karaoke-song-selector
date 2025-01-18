import { useKaraoke } from "../hooks/useKaraoke";
import { SongList, SongListItem } from "../components/SongList";
import { Song } from "shared/dist/karaoke";
import { Button } from "../components/ui/Button";

const Controls = () => {
  const { socket, isKaraokeLive, isConnected, queue } = useKaraoke();
  return (
    <div className='flex flex-col m-4'>
      {isConnected ? (
        <div>
          {isKaraokeLive ? (
            <Button onClick={() => socket.emit("karaoke:stop")}>
              Stop Karaoke
            </Button>
          ) : (
            <Button onClick={() => socket.emit("karaoke:start")}>
              Start Karaoke
            </Button>
          )}
        </div>
      ) : (
        <div>Loading....</div>
      )}
      {isKaraokeLive ? (
        <div>
          <h2>Karaoke is live!</h2>
          <SongList>
            {queue.length === 0 ? (
              <div>Waiting for first song to be selected</div>
            ) : (
              queue.map((song: Song, index: number) => (
                <SongListItem
                  key={`${song.artist}-${song.title}`}
                  artist={song.artist}
                  title={song.title}
                  options={
                    index === 0 && (
                      <div>
                        <Button onClick={() => socket.emit("song:next")}>
                          Song Finished
                        </Button>
                      </div>
                    )
                  }
                />
              ))
            )}
          </SongList>
        </div>
      ) : (
        <div>
          <h2>Waiting for karaoke to start!</h2>
        </div>
      )}
    </div>
  );
};

export default Controls;
