import { useNavigate } from 'react-router-dom';
import { SearchInput } from './SearchInput';
import { PopularRooms } from './PopularRooms';
import { useRoomStore } from '../../lib/store/room';
import { useEffect } from 'react';

export function HomePage() {
  const navigate = useNavigate();
  const reset = useRoomStore((state) => state.reset);

  // Reset room state when homepage mounts
  useEffect(() => {
    reset();
  }, [reset]);

  const handleRoomSubmit = (roomName: string) => {
    if (!roomName.trim()) return;
    
    // Reset room state before navigation
    reset();
    
    const encodedRoomName = encodeURIComponent(roomName.trim().toLowerCase());
    // Force a full navigation by using window.location
    window.location.href = `/?room=${encodedRoomName}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Token-Gated Chat Rooms
        </h1>
        <SearchInput onSubmit={handleRoomSubmit} />
        <PopularRooms />
      </div>
    </div>
  );
}