import { AdvancedVideo } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { useEffect, useRef } from 'react';

const cld = new Cloudinary({ cloud: { cloudName: 'dri819usd' } });

function VideoPlayer({ publicId, onPlay, videoRef }) {
  const containerRef = useRef(null); 
  const myVideo = cld.video(publicId);

  useEffect(() => {
    const videoEl = containerRef.current?.querySelector('video');
    if(videoRef && videoEl){
      videoRef.current = videoEl;
      videoEl.focus();
    }

    if (videoEl && onPlay) {
      const handlePlay = () => onPlay();
      videoEl.addEventListener('play', handlePlay);

      return () => {
        videoEl.removeEventListener('play', handlePlay);
      };
    }
  }, [onPlay, videoRef]);

  return (
     <div className="h-full w-full" ref={containerRef}>
      <AdvancedVideo
        className="w-full aspect-video"
        cldVid={myVideo}
        autoPlay
        controls
        playsInline
        loop
        preload="auto"
        tabIndex={-1} 
      />
    </div>
  );
}

export default VideoPlayer;
