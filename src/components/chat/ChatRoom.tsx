import { useAuth } from '../auth/useAuth';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { RoomHeader } from '../room/RoomHeader';
import { useContext } from 'react';
import { RoomContext } from '../room/RoomProvider';
import { Loader2 } from 'lucide-react';

export function ChatRoom() {
  const { isReady } = useAuth();
  const { room, isLoading, error } = useContext(RoomContext)!;

  if (!isReady || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-600">
          {!isReady ? 'Initializing...' : 'Loading room...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg max-w-md text-center">
          <h2 className="font-bold mb-2">Error</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg max-w-md text-center">
          <h2 className="font-bold mb-2">Room Not Found</h2>
          <p>The requested room could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <RoomHeader room={room} />
      <div className="p-4">
        <MessageList />
        <MessageInput />
      </div>
    </div>
  );
}