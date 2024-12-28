import { SongList, SongListItem } from "../components/SongList";
import { Song } from "shared/dist/karaoke";
import { useKaraoke } from "../hooks/useKaraoke";

export const Live = () => {
  const { isConnected, isKaraokeLive, playlist, queue, socket, session } =
    useKaraoke();

  return isConnected ? (
    <div className='flex flex-col'>
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
            />
          ))}
        </SongList>
      </div>
      <button
        disabled={session?.songId === undefined}
        onClick={() => {
          const songToCancel = queue.find((elem) => elem.id == session?.songId);

          if (songToCancel) {
            socket.emit("song:cancel", songToCancel);
          }
        }}
      >
        Chicken out!
      </button>
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
    </div>
  ) : (
    <div>Loading...</div>
  );
};
