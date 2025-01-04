import { useEffect } from 'react';
import { PrivyProvider } from './components/auth';
import { RoomProvider } from './components/room';
import { ChatRoom } from './components/chat';
import { HomePage } from './components/home/HomePage';
import { useSearchParams } from './components/room/useSearchParams';

export default function App() {
  const { roomName } = useSearchParams();

  // Force room state refresh when URL changes
  useEffect(() => {
    // Component will re-render when roomName changes
  }, [roomName]);

  return (
    <PrivyProvider>
      <RoomProvider>
        <div className={roomName ? 'chat-room' : ''}>
          {roomName ? <ChatRoom /> : <HomePage />}
        </div>
      </RoomProvider>
    </PrivyProvider>
  );
}