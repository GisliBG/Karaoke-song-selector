import { createContext, ReactNode, useState } from "react";
import { useNavigate } from "react-router";

export function AuthProvider({ children }: AuthProviderProps) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const navigate = useNavigate();

  const login = async (password: string, onError: (error: string) => void) => {
    try {
      const response = await fetch("/api/login/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      setAdmin(data);
      navigate("/band/");
    } catch (error: unknown) {
      if (error instanceof Error && error.message) {
        onError(error.message);
      }
    }
  };
  const logout = async () => {
    try {
      const response = await fetch("/api/logout/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      setAdmin(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      throw new Error("Login failed");
    }
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export interface AdminUser {
  token: string;
}

const AuthContext = createContext<{
  admin: AdminUser | null;
  login: (password: string, onError: (error: string) => void) => Promise<void>;
  logout: () => void;
} | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export { AuthContext };
