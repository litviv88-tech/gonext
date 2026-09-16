import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

import { DiaryProvider } from '@/context/diary-context';
import { ThemeModeProvider, useThemeMode } from '@/context/theme-context';

function ThemedApp() {
  const { mode, paperTheme } = useThemeMode();

  return (
    <PaperProvider theme={paperTheme}>
      <DiaryProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      </DiaryProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeModeProvider>
      <ThemedApp />
    </ThemeModeProvider>
  );
}
