import { Outlet } from "react-router";
import { NavLink } from "react-router";
import { useKaraoke } from "../hooks/useKaraoke";
import { SongList, SongListItem } from "../components/SongList";
import { Song } from "shared/dist/karaoke";
import { Button } from "../components/ui/Button";

export const Band = () => {
  const { socket, isKaraokeLive, isConnected, queue } = useKaraoke();
  return (
    <div className='flex flex-col'>
      {isConnected ? (
        isKaraokeLive ? (
          <Button onClick={() => socket.emit("karaoke:stop")}>
            Stop Karaoke
          </Button>
        ) : (
          <Button onClick={() => socket.emit("karaoke:start")}>
            Start Karaoke
          </Button>
        )
      ) : (
        <div>Loading....</div>
      )}
      {isKaraokeLive ? (
        <div>
          <h2>Karaoke is live!</h2>
          <SongList>
            {queue.map((song: Song, index: number) => (
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
            ))}
          </SongList>
        </div>
      ) : (
        <div>
          <h2>Waiting for karaoke to start!</h2>
          <nav className='flex gap-2'>
            <NavLink
              className={({ isActive }) => (isActive ? "underline" : "")}
              to='/band/catalog'
            >
              Catalog
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? "underline" : "")}
              to='/band/playlist'
            >
              Playlist
            </NavLink>
          </nav>

          <Outlet />
        </div>
      )}
    </div>
  );
};
