import api, { tokenStorage } from './api';
import { mockRepository } from './mockRepository';
import type { AuthResponse, BackendLoginResponse, ChangePasswordData, LoginCredentials, RegisterData } from '../types';
import { getProfile } from './profileService';

const useMockApi = process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  if (!useMockApi) {
    const { data } = await api.post<BackendLoginResponse>('/auth/login', credentials);
    if (!data.token || !data.user) throw new Error('The backend returned an invalid login response.');
    await tokenStorage.set(data.token);
    try {
      return { user: await getProfile(), token: data.token };
    } catch (error) {
      await tokenStorage.clear();
      throw error;
    }
  }
  const response = { user: mockRepository.getUser(), token: `mock-${Date.now()}` };
  await tokenStorage.set(response.token);
  return response;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  if (!useMockApi) {
    void data;
    throw new Error('Partner registration is not available through the current backend flow. Contact SeniorTech to set up an account.');
  }
  const user = mockRepository.updateUser({ firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone });
  const response = { user, token: `mock-${Date.now()}` };
  await tokenStorage.set(response.token);
  return response;
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (!useMockApi) {
    void email;
    throw new Error('Password reset is not available through the current backend. Contact SeniorTech for help.');
  }
}

export async function changePassword(input: ChangePasswordData): Promise<void> {
  if (!useMockApi) {
    void input;
    throw new Error('Secure password changes are not available through the current backend. Contact SeniorTech for help.');
  }
}

export async function logout(): Promise<void> {
  await tokenStorage.clear();
}