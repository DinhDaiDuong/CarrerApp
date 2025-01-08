import {MMKV} from 'react-native-mmkv';
import {initializeMMKVFlipper} from 'react-native-mmkv-flipper-plugin';

export const storage = new MMKV();

export const MMKVStorage = {
  getItem: async (key: string) => {
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem: async (key: string, value: string | boolean) => {
    storage.set(key, value);
  },
  removeItem: async (key: string) => {
    storage.delete(key);
  },
};

export const KEY_STORE = {
  LIST_RESULT: 'LIST_RESULT',
  LIST_CHAT: 'LIST_CHAT',
  CHAT_BOT: 'CHAT_BOT',
  ANNONYMOUS_TOKEN: 'ANNONYMOUS_TOKEN',
};
