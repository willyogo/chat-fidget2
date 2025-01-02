import { PrivyProvider } from './components/auth/PrivyProvider';
import { RoomProvider } from './components/room/RoomProvider';
import { ChatRoom } from './components/chat/ChatRoom';

function App() {
  return (
    <PrivyProvider>
      <RoomProvider>
        <div className="min-h-screen bg-gray-50">
          <ChatRoom />
        </div>
      </RoomProvider>
    </PrivyProvider>
  );
}

export default App;