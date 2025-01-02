import { useAuth } from '../auth/useAuth';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { RoomHeader } from '../room/RoomHeader';
import { useContext } from 'react';
import { RoomContext } from '../room/RoomProvider';
import { Loader2 } from 'lucide-react';
import { OwnerAddressModal } from '../room/OwnerAddressModal';

export function ChatRoom() {
  const { isReady } = useAuth();
  const { room, isLoading, error, needsOwnerInput, setOwnerAddress } = useContext(RoomContext)!;

  if (!isReady || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-600">
          {!isReady ? 'Initializing...' : 'Loading room...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg max-w-md text-center">
          <h2 className="font-bold mb-2">Error</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (needsOwnerInput) {
    return (
      <OwnerAddressModal
        roomName={window.location.search.split('room=')[1]?.split('&')[0] || ''}
        onSubmit={setOwnerAddress}
        onClose={() => window.history.back()}
      />
    );
  }

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg max-w-md text-center">
          <h2 className="font-bold mb-2">Room Not Found</h2>
          <p>The requested room could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <RoomHeader room={room} />
      <div className="flex-1 min-h-0 flex flex-col p-4">
        <MessageList />
        <MessageInput />
      </div>
    </div>
  );
}