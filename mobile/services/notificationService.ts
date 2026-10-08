import * as Notifications from 'expo-notifications';
import api, { isMockApiEnabled } from './api';
import { initialNotifications } from '../mockData/database';
import type { Notification } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function getNotifications(): Promise<Notification[]> {
  if (isMockApiEnabled) return [...initialNotifications];
  const { data } = await api.get<Notification[]>('/notifications');
  if (!Array.isArray(data) || data.some((item) => (
    !item
    || typeof item.id !== 'string'
    || typeof item.title !== 'string'
    || typeof item.body !== 'string'
    || typeof item.createdAt !== 'string'
    || typeof item.read !== 'boolean'
    || (item.amount !== undefined && (typeof item.amount !== 'number' || !Number.isFinite(item.amount)))
  ))) {
    throw new Error('The backend returned an invalid notifications response.');
  }
  return data;
}

export async function requestNotificationPermission(): Promise<string | null> {
  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) return null;

  const projectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
  if (!projectId && !isMockApiEnabled) {
    throw new Error('Push notifications require EXPO_PUBLIC_EAS_PROJECT_ID. Configure an EAS project and restart the app.');
  }

  const token = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
  if (!isMockApiEnabled) {
    await api.post('/notifications/device-token', { token: token.data });
  }
  return token.data;
}