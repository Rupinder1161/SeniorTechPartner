import * as Notifications from 'expo-notifications';
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
  throw new Error('The backend does not provide a partner notifications endpoint yet.');
}

export async function requestNotificationPermission(): Promise<string | null> {
  const permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) return null;
  const token = await Notifications.getExpoPushTokenAsync();
  if (!useMockApi) throw new Error('The backend does not support registering push notifications yet.');
  return token.data;
}