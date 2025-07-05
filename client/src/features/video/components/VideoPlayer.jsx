import { AdvancedVideo } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({ cloud: { cloudName: 'dri819usd' } });

function VideoPlayer({ publicId }) {
  const myVideo = cld.video(publicId); 
  return (
      <AdvancedVideo cldVid={myVideo} controls />
  );
}

export default VideoPlayer;
