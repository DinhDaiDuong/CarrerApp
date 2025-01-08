import { KEY_STORE, storage } from '@store';
import { TImage } from '@utils';
import axios from 'axios';
import { BASE_URL, ENDPOINTS_URL } from './url';
type TMethod = 'GET' | 'POST' | 'PUT';
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});
export const refreshToken = async () => {
  try {
    const token = storage.getString(KEY_STORE.ANNONYMOUS_TOKEN);
    const response = await axios.get(`${BASE_URL}/accounts/refreshToken`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { data } = response.data;
    console.log(`>>>>/accounts/refreshToken - GET response >>>`, response.data);

    // Store the new token
    storage.set(KEY_STORE.ANNONYMOUS_TOKEN, data);
    return data;
  } catch (e) {
    console.error('Failed to refresh token', e);
    throw e; // Let the app handle logout or error state
  }
};
apiClient.interceptors.response.use(
  (response) => response, // Pass successful responses through
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 and the request is not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark request as retried
      try {
        const newToken = await refreshToken();

        // Update the original request headers with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Retry the original request with the new token
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);

        // Optional: Log out the user or clear stored tokens
        storage.delete(KEY_STORE.ANNONYMOUS_TOKEN);
        throw refreshError; // Propagate error to the caller
      }
    }

    // For all other errors, reject the promise
    return Promise.reject(error);
  },
);
const api = <P, D>(url: string, method: TMethod, options: { data?: D; params?: P }) => {
  const { data, params } = options;
  const token = storage.getString(KEY_STORE.ANNONYMOUS_TOKEN);
  return apiClient({
    url,
    method,
    params,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      console.log(`>>>>${url} - ${method} response >>>`, data);
      return response.data;
    })
    .catch((error) => {
      console.error(`API Error [${url} - ${method}]:`, error);
      throw error;
    });
};

export const uploadImage = async (file: TImage) => {
  //console.log('file', file);
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios({
      baseURL: BASE_URL,
      url: ENDPOINTS_URL.UPLOAD.UPLOAD_OCR,
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    //console.log('res', response);
    const { data } = response;
    return data;
  } catch (e) {
    console.log(e);
  }
};
export default api;
