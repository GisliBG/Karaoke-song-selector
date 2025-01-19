import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  return auth?.admin ? children : <Navigate to='/login' />;
};

export { ProtectedRoute };
