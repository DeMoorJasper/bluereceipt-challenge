import { useEffect, useRef } from 'react';

export default function useFocus<T>(isFocused: boolean) {
  let ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current && isFocused) {
      // @ts-ignore
      ref.current.focus();
    }
  }, [isFocused]);

  return ref;
}
