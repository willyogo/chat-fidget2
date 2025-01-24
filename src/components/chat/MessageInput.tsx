import { useState, useRef, useEffect } from 'react';
import { Send, Smile, Image } from 'lucide-react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { useAuth } from '../auth/useAuth';
import { useTokenGate } from '../../lib/hooks/useTokenGate';
import { sendMessage } from '../../lib/api/messages';
import { useMessagesStore } from '../../lib/store/messages';
import { GifPicker } from './GifPicker';
import { useFocusManagement } from '../../lib/hooks/useFocusManagement';
import { useRoomStore } from '../../lib/store/room';
import type { IGif } from '@giphy/js-types';

export function MessageInput() {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const { login, address, isAuthenticated } = useAuth();
  const room = useRoomStore((state) => state.room);
  const version = useRoomStore((state) => state.version); // Subscribe to version changes
  const { hasAccess, isLoading: checkingAccess } = useTokenGate(
    room?.token_address || null,
    room?.required_tokens || 0,
    address
  );
  const addMessage = useMessagesStore((state) => state.addMessage);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const { elementRef: inputRef, focusElement: focusInput } = useFocusManagement();

  useEffect(() => {
    // Focus input on mount
    focusInput();
  }, [focusInput]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current && 
        !emojiPickerRef.current.contains(event.target as Node) &&
        !emojiButtonRef.current?.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleSubmit(content = message) {
    if (!content.trim() || !room?.name || isSubmitting) return;

    if (!isAuthenticated) {
      login();
      return;
    }

    if (!address) return;

    setIsSubmitting(true);
    try {
      const newMessage = await sendMessage(room.name, address, content);
      addMessage(newMessage);
      setMessage('');
      focusInput(); // Restore focus after sending
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

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    focusInput(); // Restore focus after emoji selection
  };

  const handleGifSelect = async (gif: IGif) => {
    setShowGifPicker(false);
    await handleSubmit(gif.images.original.url);
    focusInput(); // Restore focus after GIF selection
  };

  if (checkingAccess) {
    return <div className="text-center p-4">Checking access...</div>;
  }

  if (!hasAccess && room?.token_address) {
    return (
      <div className="text-center p-4 bg-yellow-50 text-yellow-800 rounded-lg">
        Must hold {room.required_tokens} of token {room.token_address} to join chat
      </div>
    );
  }

  return (
    <div className="flex gap-2 relative">
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={isAuthenticated ? "Type a message..." : "Connect wallet to chat"}
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        disabled={isSubmitting || !isAuthenticated}
      />
      
      <button
        ref={emojiButtonRef}
        onClick={() => {
          setShowEmojiPicker(!showEmojiPicker);
          setShowGifPicker(false);
        }}
        className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        disabled={!isAuthenticated}
      >
        <Smile size={20} />
      </button>

      <button
        onClick={() => {
          setShowGifPicker(!showGifPicker);
          setShowEmojiPicker(false);
        }}
        className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        disabled={!isAuthenticated}
      >
        <Image size={20} />
      </button>

      <button
        onClick={() => handleSubmit()}
        disabled={!message.trim() || isSubmitting}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={20} />
      </button>

      {showEmojiPicker && (
        <div 
          ref={emojiPickerRef}
          className="absolute right-0 bottom-full mb-2"
          style={{ zIndex: 1000 }}
        >
          <EmojiPicker 
            onEmojiClick={onEmojiClick}
            theme={Theme.LIGHT}
            width={280}
            height={350}
            previewConfig={{
              showPreview: false
            }}
            searchPlaceHolder="Search emojis..."
            skinTonesDisabled
            lazyLoadEmojis
          />
        </div>
      )}

      {showGifPicker && (
        <GifPicker
          onSelect={handleGifSelect}
          onClose={() => setShowGifPicker(false)}
        />
      )}
    </div>
  );
}