import { useEffect, useState, useCallback } from 'react';

type ImageLoaderProps = {
  src: string;
  alt: string;
  className?: string;
  onLoad?: (src: string) => void;
  onError?: (src: string) => void;
  onLoadStart?: (src: string) => void;
};

export function ImageLoader({ 
  src, 
  alt, 
  className = '', 
  onLoad, 
  onError,
  onLoadStart
}: ImageLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset states when src changes
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.(src);
  }, [onLoad, src]);

  const handleError = useCallback(() => {
    setIsLoaded(true);
    setHasError(true);
    onError?.(src);
  }, [onError, src]);

  // Preload image
  useEffect(() => {
    const img = new Image();
    
    onLoadStart?.(src);
    img.src = src;
    img.onload = handleLoad;
    img.onerror = handleError;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, handleLoad, handleError, onLoadStart]);

  return (
    <div className={`relative ${!isLoaded ? 'bg-gray-100 animate-pulse' : ''}`}>
      {!hasError && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
          loading="lazy"
        />
      )}
      {hasError && (
        <div className="bg-red-50 text-red-500 p-2 text-sm rounded">
          Failed to load image
        </div>
      )}
    </div>
  );
}