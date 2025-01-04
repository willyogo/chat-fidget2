import { useState, useCallback } from 'react';

export function useImageLoading() {
  const [loadingImages, setLoadingImages] = useState(0);

  const onImageLoad = useCallback(() => {
    setLoadingImages(count => Math.max(0, count - 1));
  }, []);

  const onImageStart = useCallback(() => {
    setLoadingImages(count => count + 1);
  }, []);

  return {
    loadingImages,
    onImageLoad,
    onImageStart,
    isLoading: loadingImages > 0
  };
}