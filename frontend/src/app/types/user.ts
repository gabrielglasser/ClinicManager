export type UserType = 'ADMIN' | 'FUNCIONARIO' | 'MEDICO';

export interface User {
  id: string;
  nome: string;
  email: string;
  photo: string;
  tipo: UserType;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}