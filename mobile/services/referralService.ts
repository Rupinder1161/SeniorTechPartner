import api from './api';
import { mockRepository } from './mockRepository';
import type { AddressCheckResponse, BackendAppointment, BackendReferrer, CreateReferralData, Referral } from '../types';
import { appointmentBelongsToReferrer, mapBackendAppointment } from './backendMappers';
import { getReferrerAccount } from './profileService';

const useMockApi = process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false';

export async function getReferrals(): Promise<Referral[]> {
  if (useMockApi) return mockRepository.getReferrals();
  const { referrer } = await getReferrerAccount();
  return getReferralsForReferrer(referrer);
}

export async function getReferralsForReferrer(referrer: BackendReferrer): Promise<Referral[]> {
  const appointments = await getAppointmentsForReferrer(referrer);
  return appointments.map(mapBackendAppointment);
}

export async function getAppointmentsForReferrer(referrer: BackendReferrer): Promise<BackendAppointment[]> {
  const { data } = await api.get<BackendAppointment[]>('/appointments');
  if (!Array.isArray(data)) throw new Error('The backend returned an invalid appointments response.');
  return data.filter((appointment) => appointmentBelongsToReferrer(appointment, referrer));
}

export async function getReferral(id: string): Promise<Referral> {
  if (useMockApi) {
    const referral = mockRepository.getReferral(id);
    if (!referral) throw new Error('Referral not found');
    return referral;
  }
  const referrals = await getReferrals();
  const referral = referrals.find((item) => item.id === id);
  if (!referral) throw new Error('Referral not found.');
  return referral;
}

export async function createReferral(input: CreateReferralData): Promise<void> {
  if (useMockApi) {
    mockRepository.createReferral(input);
    return;
  }
  await api.post('/appointments', input);
}

export async function checkAppointmentAddress(address: string): Promise<AddressCheckResponse> {
  if (useMockApi) throw new Error('Address checking is unavailable in mock mode.');
  const { data } = await api.get<AddressCheckResponse>('/appointments/address-check', { params: { address } });
  if (!data || typeof data.valid !== 'boolean') {
    throw new Error('The backend returned an invalid address-check response.');
  }
  return data;
}