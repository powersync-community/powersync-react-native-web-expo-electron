import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PowerSyncContext } from '@/powersync/context';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useSystem } from '@/powersync/system';
import { useMemo } from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const system = useSystem();
  const db = useMemo(() => {
    system.init();
    return system.powersync;
  }, [system]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

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
