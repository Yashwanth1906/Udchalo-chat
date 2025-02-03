import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';

export default function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        {/* Your existing app structure */}
      </ChatProvider>
    </ThemeProvider>
  );
} 