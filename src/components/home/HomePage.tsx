import { useNavigate } from 'react-router-dom';
import { SearchInput } from './SearchInput';
import { PopularRooms } from './PopularRooms';

export function HomePage() {
  const navigate = useNavigate();

  const handleRoomSubmit = (roomName: string) => {
    const encodedRoomName = encodeURIComponent(roomName.trim());
    navigate(`/?room=${encodedRoomName}`);
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