import { act, renderHook, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../providers/AuthProvider';

describe('authentication state', () => {
  it('signs in, registers, and signs out through the provider', async () => {
    const wrapper = ({ children }: React.PropsWithChildren) => <AuthProvider>{children}</AuthProvider>;
    const { result } = await renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isReady).toBe(true));

    await act(async () => { await result.current.login({ email: 'alex@example.com', password: 'securepass' }); });
    expect(result.current.user?.role).toBe('referral-partner');

    await act(async () => { await result.current.logout(); });
    expect(result.current.user).toBeNull();

    await act(async () => { await result.current.register({ firstName: 'Sam', lastName: 'Partner', email: 'sam@example.com', phone: '021 555 0101', password: 'securepass' }); });
    expect(result.current.user?.firstName).toBe('Sam');
    expect(result.current.user?.role).toBe('referral-partner');
  });
});