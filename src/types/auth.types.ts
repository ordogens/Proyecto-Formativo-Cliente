export type Role = "user" | "admin";

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: Role;
}

export interface AuthActionResult {
  ok: boolean;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => AuthActionResult;
  register: (data: RegisterData) => AuthActionResult;
  logout: () => void;
}
