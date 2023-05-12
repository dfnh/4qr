import { InfoIcon } from 'lucide-react';
import { memo } from 'react';

const Info = memo(function Info(props: { size?: number }) {
  const size = props.size ?? 22;
  return (
    <span className="hover:animate-hue-rotation hover:text-emerald-500 dark:hover:text-emerald-200  ">
      <InfoIcon size={size} />
    </span>
  );
});

export { Info };
