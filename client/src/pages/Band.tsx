import { Outlet } from "react-router";
import { NavLink } from "react-router";

export const Band = () => {
  return (
    <div className='flex flex-col'>
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
  );
};
