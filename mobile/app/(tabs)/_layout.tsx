import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors } from '../../constants/theme';

const icons = { index: 'grid', referrals: 'users', 'add-referral': 'plus-circle', earnings: 'dollar-sign', profile: 'user' } as const;

export default function TabsLayout() {
  return <Tabs screenOptions={({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: colors.green,
    tabBarInactiveTintColor: colors.muted,
    tabBarLabelStyle: { fontSize: 11, fontWeight: '700', paddingBottom: 2 },
    tabBarStyle: { height: 66, paddingTop: 8, borderTopColor: colors.line, backgroundColor: colors.white },
    tabBarIcon: ({ color, size }) => <Feather name={icons[route.name as keyof typeof icons] ?? 'circle'} size={size} color={color} />,
  })}>
    <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
    <Tabs.Screen name="referrals" options={{ title: 'Referrals' }} />
    <Tabs.Screen name="add-referral" options={{ title: 'Add referral' }} />
    <Tabs.Screen name="earnings" options={{ title: 'Earnings' }} />
    <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
  </Tabs>;
}