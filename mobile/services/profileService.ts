import api from './api';
import { mockRepository } from './mockRepository';
import type { BackendAuthUser, BackendReferrer, UpdateProfileData, User } from '../types';
import { getBackendUserId, mapBackendReferrerUser } from './backendMappers';

const useMockApi = process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false';

export async function getProfile(): Promise<User> {
  if (useMockApi) return mockRepository.getUser();
  const { authUser, referrer } = await getReferrerAccount();
  return mapBackendReferrerUser(authUser, referrer);
}

export async function getReferrerAccount(): Promise<{ authUser: BackendAuthUser; referrer: BackendReferrer }> {
  if (useMockApi) throw new Error('Referrer account details are only available from the real backend.');
  const { data: authUser } = await api.get<BackendAuthUser>('/auth/me');
  const userId = getBackendUserId(authUser);
  const { data: referrer } = await api.get<BackendReferrer>(`/referrers/me/${encodeURIComponent(userId)}`);
  return { authUser, referrer };
}

export async function updateProfile(input: UpdateProfileData): Promise<User> {
  if (useMockApi) return mockRepository.updateUser(input);
  void input;
  throw new Error('Profile editing is not available from the current backend.');
}