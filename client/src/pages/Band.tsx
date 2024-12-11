import { Outlet } from "react-router";
import { NavLink } from "react-router";
import { useKaraoke } from "../hooks/useKaraoke";

export const Band = () => {
  const { socket, isKaraokeLive, isConnected } = useKaraoke();
  return (
    <div className='flex flex-col'>
      {isConnected ? (
        isKaraokeLive ? (
          <button onClick={() => socket.emit("karaoke:stop")}>Stop</button>
        ) : (
          <button onClick={() => socket.emit("karaoke:start")}>Start</button>
        )
      ) : (
        <div>Loading....</div>
      )}
      {isKaraokeLive ? (
        <div>
          <h2>Karaoke is live!</h2>
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
