import { AdvancedVideo } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { useEffect, useRef } from 'react';

const cld = new Cloudinary({ cloud: { cloudName: 'dri819usd' } });

function VideoPlayer({ publicId, onPlay }) {
  const containerRef = useRef(null); // Renamed for clarity
  const myVideo = cld.video(publicId);

  useEffect(() => {
    const videoEl = containerRef.current?.querySelector('video');

    if (videoEl && onPlay) {
      const handlePlay = () => onPlay();
      videoEl.addEventListener('play', handlePlay);

      return () => {
        videoEl.removeEventListener('play', handlePlay);
      };
    }
  }, [onPlay]);

  return (
    <div className="h-full w-full" ref={containerRef}>
      <AdvancedVideo className="w-full aspect-video" cldVid={myVideo} controls />
    </div>
  );
}

export default VideoPlayer;
