import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';

export default function RootLayout() {
  useEffect(() => {
    async function setupSystemUI() {
      try {
        await NavigationBar.setVisibilityAsync('hidden');
      } catch (error) {
        console.log('NavigationBar error:', error);
      }
    }

    setupSystemUI();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="player"
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
            animation: 'fade',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}