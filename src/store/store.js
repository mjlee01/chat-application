import { create } from 'zustand'

export const useUserStore = create((set) => ({
  authUser: null,
  setAuthUser: (data) => set((state) => ({ authUser: data })),
  removeAuthUser: () => set({ authUser: null }),
}))