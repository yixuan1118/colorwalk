import { useState, useCallback } from "react";

interface PhotoSlot {
  id: string;
  dataUrl: string;
  order: number;
}

export function usePhotos(maxSlots: number = 9) {
  const [photos, setPhotos] = useState<PhotoSlot[]>([]);

  const addPhoto = useCallback(
    (dataUrl: string, order: number) => {
      setPhotos((prev) => {
        // Replace existing at this order, or add new
        const filtered = prev.filter((p) => p.order !== order);
        return [
          ...filtered,
          { id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, dataUrl, order },
        ].sort((a, b) => a.order - b.order);
      });
    },
    []
  );

  const removePhoto = useCallback((order: number) => {
    setPhotos((prev) =>
      prev.filter((p) => p.order !== order).sort((a, b) => a.order - b.order)
    );
  }, []);

  const swapPhotos = useCallback((from: number, to: number) => {
    setPhotos((prev) => {
      const a = prev.find((p) => p.order === from);
      const b = prev.find((p) => p.order === to);
      if (a && b) {
        return prev
          .map((p) => {
            if (p.order === from) return { ...p, order: to };
            if (p.order === to) return { ...p, order: from };
            return p;
          })
          .sort((a, b) => a.order - b.order);
      }
      if (a && !b) {
        return prev.map((p) => (p.order === from ? { ...p, order: to } : p));
      }
      return prev;
    });
  }, []);

  const reset = useCallback(() => {
    setPhotos([]);
  }, []);

  const photoCount = photos.length;

  const orderedPhotos: (PhotoSlot | null)[] = Array.from({ length: maxSlots }, (_, i) => {
    return photos.find((p) => p.order === i) || null;
  });

  return {
    photos,
    photoCount,
    orderedPhotos,
    addPhoto,
    removePhoto,
    swapPhotos,
    reset,
  };
}
