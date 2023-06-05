import { type DragEvent } from 'react';

const withPreventDefault =
  (handler: (e: DragEvent<HTMLDivElement>) => void) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handler(e);
  };

export { withPreventDefault };
