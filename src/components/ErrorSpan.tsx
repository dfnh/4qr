import { memo } from 'react';

const _ErrorSpan = ({ children, message }: { children?: string; message?: string }) => {
  return (
    <span role="alert" className="text-sm font-medium leading-none text-red-600">
      {message ?? children}
    </span>
  );
};

export const ErrorSpan = memo(_ErrorSpan);
