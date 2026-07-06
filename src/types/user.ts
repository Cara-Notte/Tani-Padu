export type UserRole = 'farmer' | 'buyer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  userName: string;
  role: UserRole;
  startedAt: string;
}
