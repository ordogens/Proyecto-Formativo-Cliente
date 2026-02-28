/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, User, Role } from "../types/auth.types";

const AUTH_STORAGE_KEY = "auth_user_session";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  // Restaura la sesion guardada para mantener el rol al recargar la pagina.
  const [user, setUser] = useState<User | null>(() => {
    try {
      const persisted = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!persisted) return null;

      const parsedUser = JSON.parse(persisted) as User;
      const hasValidRole = parsedUser.role === "admin" || parsedUser.role === "user";

      if (!parsedUser.id || !parsedUser.name || !hasValidRole) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
      }

      return parsedUser;
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  });

  const login = (role: Role) => {
    // 🔥 Simulación de login
    const fakeUser: User = {
      id: "1",
      name: role === "admin" ? "Admin Master" : "Usuario Normal",
      role,
    };

    setUser(fakeUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fakeUser));
  };

  const logout = () => {
    setUser(null);
    // Limpia sesion persistida al cerrar sesion.
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
};
