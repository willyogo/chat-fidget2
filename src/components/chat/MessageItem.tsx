import type { Message } from '../../lib/types/supabase';
import { useAuth } from '../auth/useAuth';
import { UserIdentity } from './UserIdentity';
import { ImageLoader } from '../common/ImageLoader';

export function MessageItem({ message }: { message: Message }) {
  const { address } = useAuth();
  const isOwn = address?.toLowerCase() === message.user_address.toLowerCase();
  const isGif = message.content.startsWith('http') && message.content.includes('giphy.com');

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isOwn ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900'
        }`}>
        <UserIdentity 
          address={message.user_address} 
          className={`text-sm ${isOwn ? 'text-indigo-100' : 'text-gray-600'} mb-1`}
          showTooltip={true}
        />
        {isGif ? (
          <ImageLoader 
            src={message.content} 
            alt="GIF"
            className="max-w-full rounded-md"
          />
        ) : (
          <div>{message.content}</div>
        )}
      </div>
    </div>
  );
}