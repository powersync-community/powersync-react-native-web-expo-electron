import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PowerSyncContext } from '@/powersync/context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSystem } from '@/powersync/system';
import { useMemo } from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const system = useSystem();
  const db = useMemo(() => {
    system.init();
    return system.powersync;
  }, [system]);

  return (
    <PowerSyncContext.Provider value={db}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PowerSyncContext.Provider>
  );
}
