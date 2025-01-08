import { UserData } from '@interfaces/DTO/Auth/auth';
import { MMKVStorage } from '@store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getLocalAccessToken } from './local-storage.store';

type AuthState = {
  isLogin: boolean;
  userInfo: Omit<UserData, 'accessToken'> | null;
  setAuthStore: (userInfo: Omit<UserData, 'accessToken'>) => void;
  resetAuthStore: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLogin: false,
      accessToken: getLocalAccessToken(),
      userInfo: null,
      setAuthStore: (userInfo) => {
        set({ userInfo, isLogin: true });
      },
      resetAuthStore: () => {
        //removeLocalAccessToken();
        set({ userInfo: null, isLogin: false });
      },
    }),
    {
      name: 'AUTH_STORE',
      storage: createJSONStorage(() => MMKVStorage),
    },
  ),
);
