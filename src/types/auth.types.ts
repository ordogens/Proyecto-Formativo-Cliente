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
}

export interface AuthActionResult {
  ok: boolean;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<AuthActionResult>;
  register: (data: RegisterData) => Promise<AuthActionResult>;
  logout: () => Promise<void>;
}
