import { useCallback, useReducer } from 'react';

const UNDO = 'UNDO';
const REDO = 'REDO';
const SET = 'SET';
const RESET = 'RESET';

type State<T> = {
  past: T[];
  present: T;
  future: T[];
};
type Action<T> = { newPresent?: T; type: typeof UNDO | typeof REDO | typeof SET | typeof RESET };

function undoReducer<T>(state: State<T>, action: Action<T>): State<T> {
  const { past, present, future } = state;
  const { type, newPresent } = action;
  switch (type) {
    case UNDO: {
      if (past.length < 1) return state;

      const previous = past.pop();
      const newPast = [...past];

      return {
        past: newPast,
        present: previous!,
        future: [present, ...future],
      };
    }
    case REDO: {
      if (future.length < 1) return state;

      const next = future.shift();
      const newFuture = [...future];

      return {
        past: [...past, present],
        present: next!,
        future: newFuture,
      };
    }
    case SET: {
      if (newPresent === present) return state;
      return {
        past: [...past, present],
        present: newPresent!,
        future: [],
      };
    }
    case RESET: {
      return {
        past: [],
        present: newPresent!,
        future: [],
      };
    }
    default:
      throw new Error('unknow action: ' + type);
  }
}

export function useUndo<T>(initialPresent: T) {
  const [state, dispatch] = useReducer(undoReducer, {
    past: [],
    present: initialPresent,
    future: [],
  } as State<T>);

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => dispatch({ type: UNDO }), []);

  const redo = useCallback(() => dispatch({ type: REDO }), []);

  const set = useCallback((newPresent: T) => dispatch({ type: SET, newPresent }), []);

  const reset = useCallback((newPresent: T) => dispatch({ type: RESET, newPresent }), []);

  return [state, { set, reset, undo, redo, canUndo, canRedo }] as const;
}
