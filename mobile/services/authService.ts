import api, { tokenStorage } from './api';
import { mockRepository } from './mockRepository';
import type { AuthResponse, ChangePasswordData, LoginCredentials, RegisterData } from '../types';

const useMockApi = process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  if (!useMockApi) {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    await tokenStorage.set(data.token);
    return data;
  }
  const response = { user: mockRepository.getUser(), token: `mock-${Date.now()}` };
  await tokenStorage.set(response.token);
  return response;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  if (!useMockApi) {
    const { data: response } = await api.post<AuthResponse>('/auth/register', data);
    await tokenStorage.set(response.token);
    return response;
  }
  const user = mockRepository.updateUser({ firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone });
  const response = { user, token: `mock-${Date.now()}` };
  await tokenStorage.set(response.token);
  return response;
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (!useMockApi) await api.post('/auth/forgot-password', { email });
}

export async function changePassword(input: ChangePasswordData): Promise<void> {
  if (!useMockApi) await api.post('/auth/change-password', input);
}

export async function logout(): Promise<void> {
  if (!useMockApi) await api.post('/auth/logout').catch(() => undefined);
  await tokenStorage.clear();
}