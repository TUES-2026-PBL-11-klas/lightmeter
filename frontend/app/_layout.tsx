import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { isLoggedIn } from '@/src/utils/api';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    if (isLoggedIn() && inAuthGroup) {
      router.replace('/(app)/meter');
    } else if (!isLoggedIn() && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [segments]);

  return <Slot />;
}