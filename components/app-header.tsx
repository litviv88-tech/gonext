import { Appbar } from 'react-native-paper';

import { useThemeMode } from '@/context/theme-context';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
};

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Appbar.Header elevated>
      <Appbar.Content title={title} subtitle={subtitle} />
      <Appbar.Action
        icon={mode === 'dark' ? 'weather-sunny' : 'weather-night'}
        accessibilityLabel={mode === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
        onPress={toggleTheme}
      />
    </Appbar.Header>
  );
}
