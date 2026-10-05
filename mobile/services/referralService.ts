import api from './api';
import { mockRepository } from './mockRepository';
import type { CreateReferralData, Referral } from '../types';

const useMockApi = process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false';

export async function getReferrals(): Promise<Referral[]> {
  if (useMockApi) return mockRepository.getReferrals();
  const { data } = await api.get<Referral[]>('/referrers');
  return data;
}

export async function getReferral(id: string): Promise<Referral> {
  if (useMockApi) {
    const referral = mockRepository.getReferral(id);
    if (!referral) throw new Error('Referral not found');
    return referral;
  }
  const { data } = await api.get<Referral>(`/referrers/${id}`);
  return data;
}

export async function createReferral(input: CreateReferralData): Promise<Referral> {
  if (useMockApi) return mockRepository.createReferral(input);
  const { data } = await api.post<Referral>('/referrers', input);
  return data;
}