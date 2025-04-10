import { useEffect, useContext } from 'react';
import { RoomContext } from '../room/RoomProvider';
import { MessageItem } from './MessageItem';
import { MessagesSquare, Loader2 } from 'lucide-react';
import { useVirtualMessages } from '../../lib/hooks/useVirtualMessages';
import { useMessagesStore } from '../../lib/store/messages';
import { useImageLoading } from '../../lib/hooks/useImageLoading';

export function MessageList() {
  const { room } = useContext(RoomContext)!;
  const { 
    loadingImages, 
    onImageLoad, 
    onImageError, 
    onImageStart 
  } = useImageLoading();
  
  const {
    messages,
    scrollRef,
    handleScroll,
    scrollToBottom,
    isLoadingMore,
    hasMore
  } = useVirtualMessages(room?.name || '', loadingImages);

  const {
    isLoading,
    loadMessages,
    subscribeToRoom,
  } = useMessagesStore();

  // Load initial messages and set up subscription
  useEffect(() => {
    if (!room?.name) return;

    loadMessages(room.name);
    const unsubscribe = subscribeToRoom(room.name);
    return () => unsubscribe();
  }, [room?.name]);

  // Auto-scroll to bottom on initial load and when all images are loaded
  useEffect(() => {
    if (!isLoading && !loadingImages) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToBottom();
        });
      });
    }
  }, [isLoading, loadingImages, scrollToBottom]);

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
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
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto min-h-0 space-y-4 mb-4 px-2 md:px-4 scroll-smooth"
    >
      {isLoadingMore && hasMore && (
        <div className="text-center py-2">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600 mx-auto" />
        </div>
      )}
      
      {messages.map((message) => (
        <MessageItem 
          key={message.id} 
          message={message}
          onImageLoad={onImageLoad}
          onImageError={onImageError}
          onImageStart={onImageStart}
        />
      ))}
    </div>
  );
}