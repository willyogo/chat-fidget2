import { useContext, useRef, useEffect, useState } from 'react';
import { useMessages } from '../../lib/hooks/useMessages';
import { RoomContext } from '../room/RoomProvider';
import { MessageItem } from './MessageItem';
import { MessagesSquare } from 'lucide-react';

export function MessageList() {
  const { room } = useContext(RoomContext)!;
  const { messages, isLoading, hasMore, isLoadingMore, loadMore } = useMessages(room?.name);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Scroll to bottom on new messages if user was already at bottom
  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAtBottom]);

  // Track scroll position to determine if user is at bottom
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
    const scrollPosition = scrollHeight - scrollTop - clientHeight;
    setIsAtBottom(scrollPosition < 50); // Consider "at bottom" if within 50px

    // Check if scrolled to top for loading more messages
    if (scrollTop === 0 && hasMore && !isLoadingMore) {
      loadMore();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-pulse text-gray-500">Loading messages...</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-gray-500">
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
      className="space-y-4 mb-4 h-[calc(100vh-200px)] overflow-y-auto"
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