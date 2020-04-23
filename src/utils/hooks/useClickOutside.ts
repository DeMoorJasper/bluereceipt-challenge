import { useRef, useEffect } from 'react';

export default function useClickOutside<T>(clickOutsideCallback: () => void): React.RefObject<T> {
  const ref = useRef<T>(null);

  // This function should actually be in useEffect but eslint did not like that...
  const handleEvent = (event: MouseEvent | TouchEvent) => {
    if (!ref || !ref.current) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    if (ref.current.contains && !ref.current.contains(event.target)) {
      clickOutsideCallback();
    }
  };

  useEffect(() => {
    // This is for server side rendering and perhaps even testing
    if (typeof window === 'undefined') {
      return () => {};
    }

    if (window.PointerEvent) {
      document.addEventListener('pointerdown', handleEvent);
    } else {
      document.addEventListener('mousedown', handleEvent);
      document.addEventListener('touchstart', handleEvent);
    }

    return () => {
      if (window.PointerEvent) {
        document.removeEventListener('pointerdown', handleEvent);
      } else {
        document.removeEventListener('mousedown', handleEvent);
        document.removeEventListener('touchstart', handleEvent);
      }
    };
  }, [typeof window, clickOutsideCallback]);

  return ref;
}
