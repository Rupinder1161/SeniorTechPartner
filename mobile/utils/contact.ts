import { Alert, Linking } from 'react-native';

const seniorTechPhone = '0224576040';

export function promptToContactSeniorTech(action: string): void {
  Alert.alert(
    'Contact SeniorTech',
    `To ${action}, please call SeniorTech on ${seniorTechPhone}.`,
    [
      {
        text: `Call ${seniorTechPhone}`,
        onPress: () => {
          void Linking.openURL(`tel:${seniorTechPhone}`).catch(() => {
            Alert.alert('Unable to place call', `Please call SeniorTech on ${seniorTechPhone}.`);
          });
        },
      },
      { text: 'Not now', style: 'cancel' },
    ],
  );
}
