/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type {
  AuthActionResult,
  AuthContextType,
  LoginCredentials,
  RegisterData,
  User,
} from "../types/auth.types";

const AUTH_STORAGE_KEY = "auth_user_session";
const AUTH_USERS_STORAGE_KEY = "auth_users_db";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

interface StoredAuthUser extends User {
  email: string;
  password: string;
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const isValidRole = (role: unknown): role is User["role"] =>
  role === "admin" || role === "user";

const readUsersFromStorage = (): StoredAuthUser[] => {
  try {
    const raw = localStorage.getItem(AUTH_USERS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as StoredAuthUser[];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) =>
        Boolean(item?.id) &&
        Boolean(item?.name) &&
        Boolean(item?.email) &&
        Boolean(item?.password) &&
        isValidRole(item?.role)
    );
  } catch {
    localStorage.removeItem(AUTH_USERS_STORAGE_KEY);
    return [];
  }
};

export const AuthProvider = ({ children }: Props) => {
  const [users, setUsers] = useState<StoredAuthUser[]>(() => readUsersFromStorage());

  // Restaura la sesion guardada para mantener el rol al recargar la pagina.
  const [user, setUser] = useState<User | null>(() => {
    try {
      const persisted = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!persisted) return null;

      const parsedUser = JSON.parse(persisted) as User;

      if (!parsedUser.id || !parsedUser.name || !isValidRole(parsedUser.role)) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
      }

      return parsedUser;
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  });

  const saveUsers = (nextUsers: StoredAuthUser[]) => {
    setUsers(nextUsers);
    localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(nextUsers));
  };

  const login = ({ email, password }: LoginCredentials): AuthActionResult => {
    const normalizedEmail = normalizeEmail(email);
    const matchedUser = users.find(
      (account) =>
        normalizeEmail(account.email) === normalizedEmail &&
        account.password === password
    );

    if (!matchedUser) {
      return { ok: false, error: "Correo o contrasena incorrectos" };
    }

    const sessionUser: User = {
      id: matchedUser.id,
      name: matchedUser.name,
      role: matchedUser.role,
    };

    setUser(sessionUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));

    return { ok: true };
  };

  const register = ({
    username,
    email,
    password,
    role,
  }: RegisterData): AuthActionResult => {
    const normalizedEmail = normalizeEmail(email);
    const alreadyExists = users.some(
      (account) => normalizeEmail(account.email) === normalizedEmail
    );

    if (alreadyExists) {
      return { ok: false, error: "Ese correo ya esta registrado" };
    }

    const newAccount: StoredAuthUser = {
      id: `${Date.now()}`,
      name: username.trim(),
      email: normalizedEmail,
      password,
      role,
    };

    saveUsers([...users, newAccount]);

    const sessionUser: User = {
      id: newAccount.id,
      name: newAccount.name,
      role: newAccount.role,
    };

    setUser(sessionUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));

    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    // Limpia sesion persistida al cerrar sesion.
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
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
