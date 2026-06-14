import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../src/contexts/auth';
import { Colors } from '../src/constants/colors';
import { OfflineWarning } from '../src/components/OfflineWarning';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppNavigation() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
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
        name="(auth)/login"
        options={{ headerShown: false, animation: 'fade' }}
      />
      <Stack.Screen
        name="(auth)/register"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="favorites"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="history"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="my-list"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="parental-control"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="settings"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="help"
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
  );
}

export default function RootLayout() {
  useEffect(() => {
    async function setupSystemUI() {
      try {
        await NavigationBar.setButtonStyleAsync('light');
      } catch (error) {
        console.log('NavigationBar error:', error);
      }
    }
    setupSystemUI();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppNavigation />
          <OfflineWarning />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}