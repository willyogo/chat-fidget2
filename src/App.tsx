import { PrivyProvider } from './components/auth';
import { RoomProvider } from './components/room';
import { ChatRoom } from './components/chat';

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