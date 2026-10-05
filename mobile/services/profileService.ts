import api from './api';
import { mockRepository } from './mockRepository';
import type { UpdateProfileData, User } from '../types';

const useMockApi = process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false';

export async function getProfile(): Promise<User> {
  if (useMockApi) return mockRepository.getUser();
  const { data } = await api.get<User>('/profile');
  return data;
}

export async function updateProfile(input: UpdateProfileData): Promise<User> {
  if (useMockApi) return mockRepository.updateUser(input);
  const { data } = await api.patch<User>('/profile', input);
  return data;
}