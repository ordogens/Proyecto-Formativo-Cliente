/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState,} from "react";
import type { ReactNode } from "react";
import type { AuthContextType, User, Role } from "../data/auth.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: Role) => {
    // 🔥 Simulación de login
    const fakeUser: User = {
      id: "1",
      name: role === "admin" ? "Admin Master" : "Usuario Normal",
      role,
    };

    setUser(fakeUser);
  };

  const logout = () => {
    setUser(null);
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
