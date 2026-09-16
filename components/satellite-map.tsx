import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { AppScreen } from '@/components/app-screen';

export default function SatelliteMap() {
  return (
    <AppScreen title="Дневник туриста" subtitle="Вид со спутника">
      <View style={styles.content}>
        <Text variant="titleMedium" style={styles.message}>
          Спутниковая карта работает в Expo Go на телефоне.
        </Text>
        <Text variant="bodyMedium" style={styles.message}>
          Откройте приложение по QR-коду и удерживайте точку на карте, чтобы добавить место.
        </Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  message: {
    textAlign: 'center',
  },
});
