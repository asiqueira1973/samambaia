import { Stack, router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';

import { PLANT_ID_DATA_KEY, configureNotifications } from '@/lib/notifications';
import { PlantsProvider, usePlants } from '@/store/plants';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

/** Abre a planta certa quando o usuário toca no lembrete de rega. */
function useNotificationNavigation() {
  const response = Notifications.useLastNotificationResponse();
  const handled = useRef<string | null>(null);

  useEffect(() => {
    if (!response) return;

    const { identifier } = response.notification.request;
    if (handled.current === identifier) return;
    handled.current = identifier;

    const plantId = response.notification.request.content.data?.[PLANT_ID_DATA_KEY];
    if (typeof plantId === 'string') {
      router.navigate({ pathname: '/planta/[id]', params: { id: plantId } });
    }
  }, [response]);
}

function Navigation() {
  const { loading } = usePlants();
  useNotificationNavigation();

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync();
  }, [loading]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface },
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="nova" options={{ presentation: 'modal' }} />
      <Stack.Screen name="editar/[id]" options={{ presentation: 'modal' }} />
      <Stack.Screen name="planta/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    configureNotifications();
  }, []);

  return (
    <PlantsProvider>
      <StatusBar style="dark" />
      <Navigation />
    </PlantsProvider>
  );
}
