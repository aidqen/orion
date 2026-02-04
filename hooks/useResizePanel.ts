import { useState, useRef, useEffect, useCallback } from 'react';
import { grab } from '@/lib/cursor-grabbing';

interface UseResizePanelOptions {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  onWidthChange?: (width: number) => void;
}

interface UseResizePanelReturn {
  width: number;
  handleMouseDown: (e: React.MouseEvent) => void;
  isDragging: boolean;
}

export function useResizePanel({
  initialWidth = 500,
  minWidth = 300,
  maxWidth = 900,
  onWidthChange,
}: UseResizePanelOptions = {}): UseResizePanelReturn {
  const [width, setWidth] = useState(initialWidth);
  const [isDragging, setIsDragging] = useState(false);

  // Use refs for values that change during drag to avoid re-renders
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const pendingWidthRef = useRef<number | null>(null);

  // Handle mouse move during drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      // Calculate new width: dragging LEFT increases width (panel is on right)
      const deltaX = startXRef.current - e.clientX;
      const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidthRef.current + deltaX));

      // Store pending width for rAF update
      pendingWidthRef.current = newWidth;

      // Use rAF to batch DOM updates
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          if (pendingWidthRef.current !== null) {
            setWidth(pendingWidthRef.current);
            onWidthChange?.(pendingWidthRef.current);
          }
          rafIdRef.current = null;
        });
      }
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return;

      isDraggingRef.current = false;
      setIsDragging(false);
      grab.end();

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      if (pendingWidthRef.current !== null) {
        setWidth(pendingWidthRef.current);
        onWidthChange?.(pendingWidthRef.current);
        pendingWidthRef.current = null;
      }
    };

    // Attach listeners to document for better drag handling
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // Cleanup rAF on unmount
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [minWidth, maxWidth, onWidthChange]);

  // Mouse down handler to start dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    pendingWidthRef.current = null;

    setIsDragging(true);
    grab.start();
  }, [width]);

  return {
    width,
    handleMouseDown,
    isDragging,
  };
}
