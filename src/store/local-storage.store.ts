import {storage} from '@store';
import {LOCAL_STORAGE} from '@utils/constants/local-storage.constant';

export const setLocalAccessToken = (accessToken: string) => {
  storage.set(LOCAL_STORAGE.ACCESS_TOKEN, accessToken);
};

export const getLocalAccessToken = (): string | null => {
  return storage.getString(LOCAL_STORAGE.ACCESS_TOKEN) || null;
};

export const removeLocalAccessToken = (): void => {
  storage.delete(LOCAL_STORAGE.ACCESS_TOKEN);
};
