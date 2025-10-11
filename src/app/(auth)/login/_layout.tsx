import { Slot } from 'expo-router';
import { LoginProvider } from '../../../contexts/LoginContext';

export default function Layout() {
  return (
    <LoginProvider>
      <Slot />
    </LoginProvider>
  );
}