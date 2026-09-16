import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import { AppHeader } from '@/components/app-header';

type AppScreenProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function AppScreen({ title, subtitle, children }: AppScreenProps) {
  const theme = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <AppHeader title={title} subtitle={subtitle} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
