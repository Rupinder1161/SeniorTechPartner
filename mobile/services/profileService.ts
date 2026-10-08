import api, { isMockApiEnabled } from './api';
import { mockRepository } from './mockRepository';
import type { BackendAuthUser, BackendReferrer, UpdateProfileData, User } from '../types';
import { getBackendUserId, mapBackendReferrerUser } from './backendMappers';

export async function getProfile(): Promise<User> {
  if (isMockApiEnabled) return mockRepository.getUser();
  const { authUser, referrer } = await getReferrerAccount();
  return mapBackendReferrerUser(authUser, referrer);
}

export async function getReferrerAccount(): Promise<{ authUser: BackendAuthUser; referrer: BackendReferrer }> {
  if (isMockApiEnabled) throw new Error('Referrer account details are only available from the real backend.');
  const { data: authUser } = await api.get<BackendAuthUser>('/auth/me');
  const userId = getBackendUserId(authUser);
  const { data: referrer } = await api.get<BackendReferrer>(`/referrers/me/${encodeURIComponent(userId)}`);
  return { authUser, referrer };
}

export async function updateProfile(input: UpdateProfileData): Promise<User> {
  if (isMockApiEnabled) return mockRepository.updateUser(input);
  void input;
  throw new Error('Profile editing is not available from the current backend.');
}