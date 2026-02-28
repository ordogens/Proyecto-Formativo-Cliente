export type Role = "user" | "admin";

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface AuthContextType {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
}