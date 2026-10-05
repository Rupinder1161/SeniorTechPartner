import api from './api';
import { mockRepository } from './mockRepository';
import type { DashboardData } from '../types';

const useMockApi = process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false';

export async function getDashboard(): Promise<DashboardData> {
  if (useMockApi) return mockRepository.getDashboard();
  const { data } = await api.get<DashboardData>('/dashboard');
  return data;
}