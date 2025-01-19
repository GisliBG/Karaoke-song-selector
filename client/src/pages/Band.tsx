import { Outlet } from "react-router";
import { NavLink } from "react-router";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

export const Band = () => {
  const auth = useAuth();
  return (
    <div className='flex flex-col'>
      <div className='flex justify-end'>
        <Button onClick={() => auth.logout()}>Logout</Button>
      </div>
      <nav className='flex gap-2'>
        <NavLink
          className={({ isActive }) => (isActive ? "underline" : "")}
          to='/band/controls'
        >
          Controls
        </NavLink>
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
      <div className='mt-2'>
        <Outlet />
      </div>
    </div>
  );
};
