import { PrivyProvider } from './components/auth/PrivyProvider';
import { RoomProvider } from './components/room/RoomProvider';
import { ChatRoom } from './components/chat/ChatRoom';

export default function App() {
  return (
    <PrivyProvider>
      <RoomProvider>
        <div className="h-screen max-h-screen overflow-hidden bg-gray-50">
          <ChatRoom />
        </div>
      </RoomProvider>
    </PrivyProvider>
  );
}