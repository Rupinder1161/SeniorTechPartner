import api from './api';
import { earningsSummary } from '../mockData/database';
import { mockRepository } from './mockRepository';
import type { EarningsSummary, EarningsTransaction } from '../types';

const useMockApi = process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false';

export async function getEarnings(): Promise<EarningsSummary> {
  if (useMockApi) return earningsSummary;
  const { data } = await api.get<EarningsSummary>('/earnings/summary');
  return data;
}

export async function getEarningsHistory(): Promise<EarningsTransaction[]> {
  if (useMockApi) return mockRepository.getTransactions();
  const { data } = await api.get<EarningsTransaction[]>('/earnings/history');
  return data;
}