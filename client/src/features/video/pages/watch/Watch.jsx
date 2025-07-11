import {useRef, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoPlayer from "../../components/VideoPlayer";
import videoService from '../../services/videoService.js';
import VideoLikeButton from '../../../../shared/components/VideoLikeButton.jsx'
import DescriptionBox from '../../../../shared/components/DescriptionBox.jsx';
import CommentAndUpnext from './CommentAndUpnext.jsx';
import { Link } from 'react-router-dom';

function Watch() {
const [video, setVideo] = useState(null);
const [searchParams] = useSearchParams();
  

// Inside your Watch component
const viewTimerRef = useRef(null);

   const onPlay = () => {
    if (viewTimerRef.current || !video?._id) return;

      const durationInSeconds = Number(video.duration);
      const isValidDuration = !isNaN(durationInSeconds);
      const waitTime = isValidDuration && durationInSeconds <= 30
        ? durationInSeconds * 1000
        : 30000;

      viewTimerRef.current = setTimeout(() => {
        videoService.incrementView(video._id)
          .catch((err) => console.error("Failed to increment view", err));

        // setVideo((prev) => ({
        //    ...prev,
        //    views: prev.views + 1,
        // }));
      }, waitTime);
   };

   useEffect(() => {
    return () => {
      if (viewTimerRef.current) {
        clearTimeout(viewTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const videoId = searchParams.get("vi");
    if (!videoId) return;
    const fetchvideo = async () => {
      try {
        const res = await videoService.getVideoById(videoId);
        setVideo(res.data?.data?.video);
      } catch (error) {
        console.error(error);
      }
    };

    fetchvideo();
  }, [searchParams]);

  const publicId = searchParams.get("pi");
  const videoId = searchParams.get("vi");

  return (
    <div className="w-full h-full mx-4 mt-3 flex">
     
     {video ? (
            <>
      {/* left container */}
      <div className='h-full w-[62%] ml-3'>
        <div className="aspect-video flex">
          <VideoPlayer className="w-full h-full" publicId={publicId} onPlay={onPlay}/>
        </div>

      
        {/* video details */}
        <div className='mt-4 text-white'>
              <div className="text-2xl font-bold">{video.title}</div>

              <div className="flex justify-between items-start mt-2">
                {/* Left box: channel details */}
                <div className="flex items-center space-x-3">
                  <img src={video.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <Link to={`/u/${video.username}`}><div className='text-xl'>{video.username}</div></Link>
                    <div className="text-base text-gray-300">subscribers</div>
                  </div>


                </div>

                {/* Right box: like/share */}
                <div className="flex space-x-4 self-center pr-8">
                  {/* isLiked initialLiked likesCount */}
                  <div className='flex justify-center items-center h-12 w-24 bg-gray-700 hover:bg-gray-500 rounded-2xl'>
                    <VideoLikeButton key={video._id} isLiked={video.isLiked} likesCount={video.likesCount} videoId={video._id} />
                  </div>
                  <div className='flex justify-center items-center h-12 w-24 bg-gray-700 hover:bg-gray-500 rounded-2xl'>
                    <button>share</button>
                  </div>
                  <div className='flex justify-center items-center h-12 w-24 bg-gray-700 hover:bg-gray-500 rounded-2xl'>
                    <button>{"[<>]"}</button>
                  </div>
                </div>
              </div>
          

          <DescriptionBox views={video.views} createdAt={video.createdAt} 
            description={video.description} updatedAt={video.updatedAt}/>
        </div>
       
        <CommentAndUpnext videoId={videoId} initialTab={"upnext"}/>
      </div>
       </>
        ) : (
            <div className="h-full w-[62%] ml-3">Loading video...</div>
        )}

      {/* right container */}
      <div className='text-white w-[35%] px-2 pt-3 flex flex-col flex-center'>
        {/* Toggle button */}
       {video &&<CommentAndUpnext videoId={videoId} comment={true}/>}
      </div>
    </div>
  );
}

export default Watch;
	