import { forwardRef, type VideoHTMLAttributes } from 'react';

export type CameraProps = VideoHTMLAttributes<HTMLVideoElement>;

const Camera = forwardRef<HTMLVideoElement | null, CameraProps>(({ ...props }, ref) => {
  return (
    <div className="flex w-full max-w-md">
      <video
        className="aspect-video w-full border border-solid border-gray-300"
        ref={ref}
        {...props}
      ></video>
    </div>
  );
});
Camera.displayName = 'Camera';

export { Camera };
