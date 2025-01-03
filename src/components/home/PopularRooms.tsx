import { useEffect, useState } from 'react';
import { Trophy, Users, MessageSquare } from 'lucide-react';
import { RoomName } from '../room/RoomName';
import { getPopularRooms } from '../../lib/api/rooms';
import type { Room } from '../../lib/types/supabase';

type RoomWithStats = Room & {
  message_count: number;
  unique_users: number;
};

export function PopularRooms() {
  const [rooms, setRooms] = useState<RoomWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadRooms() {
      try {
        const data = await getPopularRooms();
        if (mounted) {
          setRooms(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load popular rooms');
          console.error(err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadRooms();
    return () => { mounted = false; };
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-12 px-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-12 px-4">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="text-xl font-semibold">Popular Rooms</h2>
      </div>

      <div className="space-y-4">
        {rooms.map((room, index) => (
          <a
            key={room.name}
            href={`/?room=${room.name}`}
            className="block bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-8 text-lg font-bold text-gray-400">
                #{index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <RoomName room={room} className="text-lg font-medium" />
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {room.message_count.toLocaleString()} messages
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {room.unique_users.toLocaleString()} users
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}