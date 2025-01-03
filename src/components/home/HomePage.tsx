import { useNavigate } from 'react-router-dom';
import { SearchInput } from './SearchInput';
import { PopularRooms } from './PopularRooms';

export function HomePage() {
  const navigate = useNavigate();

  const handleRoomSubmit = (roomName: string) => {
    // Ensure room name is properly encoded for URLs
    const encodedRoomName = encodeURIComponent(roomName.trim());
    navigate(`/?room=${encodedRoomName}`);
    // Force a page reload to ensure room state is properly initialized
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Token-Gated Chat Rooms
        </h1>
        <SearchInput onSubmit={handleRoomSubmit} />
        <PopularRooms />
      </div>
    </div>
  );
}