import * as Notifications from 'expo-notifications';
import api from './api';
import { initialNotifications } from '../mockData/database';
import type { Notification } from '../types';

const useMockApi = process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function getNotifications(): Promise<Notification[]> {
  if (useMockApi) return [...initialNotifications];
  const { data } = await api.get<Notification[]>('/notifications');
  return data;
}

export async function requestNotificationPermission(): Promise<string | null> {
  const permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) return null;
  const token = await Notifications.getExpoPushTokenAsync();
  if (!useMockApi) await api.post('/notifications/device-token', { token: token.data });
  return token.data;
}