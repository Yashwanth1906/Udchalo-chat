import { Stack } from 'expo-router';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';

export default function Layout() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
      </ChatProvider>
    </ThemeProvider>
  );
} 