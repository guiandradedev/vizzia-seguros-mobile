import { CreateAccountProvider } from '@/contexts/CreateAccountContext';
import { Slot } from 'expo-router';

export default function Layout() {
  return (
    <CreateAccountProvider>
      <Slot />
    </CreateAccountProvider>
  );
}