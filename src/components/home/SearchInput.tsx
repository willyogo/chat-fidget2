import { useState } from 'react';
import { Search } from 'lucide-react';

type SearchInputProps = {
  onSubmit: (roomName: string) => void;
};

export function SearchInput({ onSubmit }: SearchInputProps) {
  const [roomName, setRoomName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim()) {
      onSubmit(roomName.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name or contract address"
          className="w-full px-4 py-3 pl-12 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Join/Create Room
        </button>
      </form>
      <p className="mt-2 text-sm text-gray-600 text-center">
        Create a new room or join an existing one by entering a room name or Ethereum contract address
      </p>
    </div>
  );
}