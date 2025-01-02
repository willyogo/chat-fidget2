import { useAuth } from '../auth/useAuth';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { RoomHeader } from '../room/RoomHeader';
import { useContext, useState } from 'react';
import { RoomContext } from '../room/RoomProvider';
import { RoomSettings } from '../room/RoomSettings';

export function ChatRoom() {
  const { isReady } = useAuth();
  const { room, isLoading, error } = useContext(RoomContext)!;
  const [showSettings, setShowSettings] = useState(false);

  if (!isReady || isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">{error.message}</div>;
  }

  if (!room) {
    return <div className="p-4">Room not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <RoomHeader room={room} onOpenSettings={() => setShowSettings(true)} />
      <div className="p-4">
        <MessageList />
        <MessageInput />
      </div>
      {showSettings && (
        <RoomSettings room={room} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}