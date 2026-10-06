import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { notifyUnauthorized } from './authEvents';

const tokenKey = 'seniortech.authToken';
let webToken: string | null = null;
const apiHost = (process.env.EXPO_PUBLIC_API_URL ?? 'https://backend-snw4.onrender.com').replace(/\/+$/, '');

export const tokenStorage = {
  get: () => Platform.OS === 'web' ? Promise.resolve(webToken) : SecureStore.getItemAsync(tokenKey),
  set: async (token: string) => {
    if (Platform.OS === 'web') {
      webToken = token;
      return;
    }
    await SecureStore.setItemAsync(tokenKey, token);
  },
  clear: async () => {
    if (Platform.OS === 'web') {
      webToken = null;
      return;
    }
    await SecureStore.deleteItemAsync(tokenKey);
  },
};

const api = axios.create({
  baseURL: `${apiHost}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) notifyUnauthorized();
    return Promise.reject(error);
  },
);

export default api;