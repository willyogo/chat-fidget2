import { useState, useRef, useEffect } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { giphyClient } from '../../lib/config';
import { useOnClickOutside } from '../../lib/hooks/useOnClickOutside';
import type { IGif } from '@giphy/js-types';

type GifPickerProps = {
  onSelect: (gif: IGif) => void;
  onClose: () => void;
};

export function GifPicker({ onSelect, onClose }: GifPickerProps) {
  const [query, setQuery] = useState('');
  const [gifs, setGifs] = useState<IGif[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<number>();

  useOnClickOutside(containerRef, onClose);

  // Load trending GIFs initially
  useEffect(() => {
    async function loadTrending() {
      try {
        setIsLoading(true);
        const { data } = await giphyClient.trending({ limit: 8 });
        setGifs(data);
        setError(null);
      } catch (err) {
        console.error('Error loading trending GIFs:', err);
        setError('Failed to load GIFs');
      } finally {
        setIsLoading(false);
      }
    }
    loadTrending();
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    if (!query.trim()) return;

    if (searchTimeout.current) {
      window.clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        const { data } = await giphyClient.search(query, { limit: 8 });
        setGifs(data);
        setError(null);
      } catch (err) {
        console.error('Error searching GIFs:', err);
        setError('Failed to search GIFs');
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      if (searchTimeout.current) {
        window.clearTimeout(searchTimeout.current);
      }
    };
  }, [query]);

  return (
    <div 
      ref={containerRef}
      className="absolute right-0 bottom-full mb-2 w-[320px] bg-white rounded-lg shadow-lg border overflow-hidden"
      style={{ zIndex: 1000 }}
    >
      {/* Header */}
      <div className="p-2 border-b flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search GIFs..."
            className="w-full pl-8 pr-2 py-1.5 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="h-[200px] overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-4">{error}</div>
        ) : gifs.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No GIFs found</div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {gifs.map((gif) => (
              <button
                key={gif.id}
                onClick={() => onSelect(gif)}
                className="relative aspect-video bg-gray-100 rounded-md overflow-hidden hover:ring-2 hover:ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <img
                  src={gif.images.fixed_height_small.url}
                  alt={gif.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* GIPHY Attribution */}
      <div className="p-2 border-t bg-gray-50 flex items-center justify-end">
        <img
          src="/powered-by-giphy.gif"
          alt="Powered by GIPHY"
          className="h-5"
        />
      </div>
    </div>
  );
}