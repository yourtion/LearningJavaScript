import { useState } from 'react';

export function useUndo<T>(initialPresent: T) {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState(initialPresent);
  const [future, setFuture] = useState<T[]>([]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const undo = () => {
    if (!canUndo) return;

    const previous = past.pop();
    const newPast = [...past];

    setPast(newPast);
    setPresent(previous!);
    setFuture([present, ...future]);
  };

  const redo = () => {
    if (!canRedo) return;

    const next = future.shift();
    const newFuture = [...future];

    setPast([...past, present]);
    setPresent(next!);
    setFuture(newFuture);
  };

  const set = (newPresent: T) => {
    if (newPresent === present) return;
    setPast([...past, present]);
    setPresent(newPresent);
    setFuture([]);
  };

  const reset = (newPresent: T) => {
    setPast([]);
    setPresent(newPresent);
    setFuture([]);
  };

  return [
    { past, present, future },
    { set, reset, undo, redo, canUndo, canRedo },
  ] as const;
}
