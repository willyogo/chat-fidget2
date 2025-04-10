import { create } from 'zustand';

type AuthStore = {
  lastAuthAttempt: number;
  setLastAuthAttempt: (timestamp: number) => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  lastAuthAttempt: 0,
  setLastAuthAttempt: (timestamp) => set({ lastAuthAttempt: timestamp }),
}));