import { useState, useCallback, useRef } from 'react';

export function useImageLoading() {
  const [loadingImages, setLoadingImages] = useState(0);
  const pendingImages = useRef(new Set<string>());

  const onImageStart = useCallback((src: string) => {
    if (!pendingImages.current.has(src)) {
      pendingImages.current.add(src);
      setLoadingImages(count => count + 1);
    }
  }, []);

  const onImageLoad = useCallback((src: string) => {
    if (pendingImages.current.has(src)) {
      pendingImages.current.delete(src);
      setLoadingImages(count => Math.max(0, count - 1));
    }
  }, []);

  const onImageError = useCallback((src: string) => {
    if (pendingImages.current.has(src)) {
      pendingImages.current.delete(src);
      setLoadingImages(count => Math.max(0, count - 1));
    }
  }, []);

  return {
    loadingImages,
    onImageLoad,
    onImageError,
    onImageStart,
    isLoading: loadingImages > 0
  };
}