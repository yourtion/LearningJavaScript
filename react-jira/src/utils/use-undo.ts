import { useCallback, useState } from 'react';

export function useUndo<T>(initialPresent: T) {
  const [state, setState] = useState({
    past: [] as T[],
    present: initialPresent,
    future: [] as T[],
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => {
    setState((currentState) => {
      const { past, present, future } = currentState;
      if (past.length < 1) return currentState;

      const previous = past.pop();
      const newPast = [...past];

      return {
        past: newPast,
        present: previous!,
        future: [present, ...future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((currentState) => {
      const { past, present, future } = currentState;
      if (future.length < 1) return currentState;

      const next = future.shift();
      const newFuture = [...future];

      return {
        past: [...past, present],
        present: next!,
        future: newFuture,
      };
    });
  }, []);

  const set = useCallback((newPresent: T) => {
    setState((currentState) => {
      const { past, present } = currentState;
      if (newPresent === present) return currentState;
      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      };
    });
  }, []);

  const reset = useCallback((newPresent: T) => {
    setState(() => {
      return {
        past: [],
        present: newPresent,
        future: [],
      };
    });
  }, []);

  return [state, { set, reset, undo, redo, canUndo, canRedo }] as const;
}
