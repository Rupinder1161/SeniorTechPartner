import { getUserMessage } from '../utils/errors';

describe('API error messages', () => {
  it('preserves safe backend 404 messages such as a missing referrer profile', () => {
    expect(getUserMessage({
      isAxiosError: true,
      response: { status: 404, data: { message: 'Referrer not found' } },
    })).toBe('Referrer not found');
  });

  it('does not expose backend server-error details', () => {
    expect(getUserMessage({
      isAxiosError: true,
      response: { status: 500, data: { message: 'database internals' } },
    })).toBe('Our service is having trouble. Please try again shortly.');
  });
});