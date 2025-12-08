import { SessionProvider } from "@/login_extras/ctx";
import { Slot } from 'expo-router';
import Toast from 'react-native-toast-message';
export default function RootLayout() {
  return (
    <>
    <SessionProvider>
      <Slot />
    </SessionProvider>
    <Toast />
    </>
  );
}

