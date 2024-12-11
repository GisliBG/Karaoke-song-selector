import { SongList, SongListItem } from "../components/SongList";
import { Song } from "shared/dist/karaoke";
import { useKaraoke } from "../hooks/useKaraoke";

export const Live = () => {
  const { isConnected, isKaraokeLive, setList, queue, socket } = useKaraoke();

  return isConnected ? (
    <div className='flex flex-col'>
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
