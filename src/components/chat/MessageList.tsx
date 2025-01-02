import { useRef, useEffect, useState } from 'react';
import { useContext } from 'react';
import { RoomContext } from '../room/RoomProvider';
import { MessageItem } from './MessageItem';
import { MessagesSquare } from 'lucide-react';
import { useMessagesStore } from '../../lib/store/messages';

export function MessageList() {
  const { room } = useContext(RoomContext)!;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const {
    messages,
    isLoading,
    hasMore,
    isLoadingMore,
    loadMessages,
    loadMoreMessages,
    subscribeToRoom,
  } = useMessagesStore();

  useEffect(() => {
    if (!room?.name) return;

    loadMessages(room.name);
    const unsubscribe = subscribeToRoom(room.name);
    return () => unsubscribe();
  }, [room?.name]);

  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAtBottom]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
    const scrollPosition = scrollHeight - scrollTop - clientHeight;
    setIsAtBottom(scrollPosition < 50);

    if (scrollTop === 0 && hasMore && !isLoadingMore && room?.name) {
      loadMoreMessages(room.name);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="animate-pulse text-gray-500">Loading messages...</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
        <MessagesSquare size={48} className="mb-4 opacity-50" />
        <p className="text-lg">No messages yet</p>
        <p className="text-sm">Be the first to send a message!</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto min-h-0 space-y-4 mb-4 px-2 md:px-4"
    >
      {isLoadingMore && (
        <div className="text-center py-2 text-gray-500">
          Loading more messages...
        </div>
      )}
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}