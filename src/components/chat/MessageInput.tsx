import { useState, useContext } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { RoomContext } from '../room/RoomProvider';
import { useTokenGate } from '../../lib/hooks/useTokenGate';
import { sendMessage } from '../../lib/api/messages';
import { useMessagesStore } from '../../lib/store/messages';

export function MessageInput() {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { room } = useContext(RoomContext)!;
  const { login, address, isAuthenticated } = useAuth();
  const { hasAccess, isLoading: checkingAccess } = useTokenGate(
    room?.token_address || null,
    room?.required_tokens || 0,
    address
  );
  const addMessage = useMessagesStore((state) => state.addMessage);

  async function handleSubmit() {
    if (!message.trim() || !room?.name || isSubmitting) return;

    if (!isAuthenticated) {
      login();
      return;
    }

    if (!address) return;

    setIsSubmitting(true);
    try {
      const newMessage = await sendMessage(room.name, address, message);
      addMessage(newMessage);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (checkingAccess) {
    return <div className="text-center p-4">Checking access...</div>;
  }

  if (!hasAccess) {
    return (
      <div className="text-center p-4 bg-yellow-50 text-yellow-800 rounded-lg">
        Must hold {room?.required_tokens} of token {room?.token_address} to join chat
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={isAuthenticated ? "Type a message..." : "Connect wallet to chat"}
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        disabled={isSubmitting || !isAuthenticated}
      />
      <button
        onClick={handleSubmit}
        disabled={!message.trim() || isSubmitting}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={20} />
      </button>
    </div>
  );
}