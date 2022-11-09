import { useState } from 'react';

export const useMoveCount = () => {
  const [moveCount, setMoveCount] = useState(0);

  const increment = () => setMoveCount(moveCount + 1);
  const reset = () => setMoveCount(0);

  return { moveCount, incrementMoveCount: increment, resetMoveCount: reset };
};
