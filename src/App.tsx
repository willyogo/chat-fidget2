import { useEffect } from 'react';
import { PrivyProvider } from './components/auth';
import { RoomProvider } from './components/room';
import { ChatRoom } from './components/chat';
import { HomePage } from './components/home/HomePage';
import { useSearchParams } from './components/room/useSearchParams';
import { useRoomStore } from './lib/store/room';

export default function App() {
  const { roomName } = useSearchParams();
  const resetRoom = useRoomStore((state) => state.reset);

  // Reset room state and force re-mount of RoomProvider when URL changes
  useEffect(() => {
    // console.log('Room name changed:', roomName);
    resetRoom();
  }, [roomName, resetRoom]);

  // Force a clean remount of components when room changes
  const key = roomName ? `room-${roomName}` : 'home';

  return (
    <PrivyProvider>
      <RoomProvider key={key}>
        <div className={roomName ? 'chat-room' : ''}>
          {roomName ? <ChatRoom /> : <HomePage />}
        </div>
      </RoomProvider>
    </PrivyProvider>
  );
}