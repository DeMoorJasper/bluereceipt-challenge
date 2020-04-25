import { useRef, useEffect } from 'react';

export default function useClickOutside(onClickOutside: () => any): React.Ref<any> {
  let ref = useRef();
  let isBrowser = typeof window === 'undefined';

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleEvent = (e: any) => {
      if (ref && ref.current) {
        // @ts-ignore
        if (!ref.current.contains(e.target)) {
          onClickOutside();
        }
      }
    };

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
  }, [isBrowser, onClickOutside]);

  return ref;
}
