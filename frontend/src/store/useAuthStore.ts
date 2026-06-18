import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  username: string;
  role: string;
}

interface AuthState {
  user: { id: number; name: string; role: string } | null;
  token: string | null;
  permissions: string[]; 
  setAuth: (token: string, user: User, permissions: string[]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      permissions: [],
      setAuth: (token, user, permissions) => set({ token, user, permissions }),
      logout: () => set({ token: null, user: null, permissions: [] }),
    }),
    { name: 'auth-storage' }
  )
);