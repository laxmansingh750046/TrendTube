import {useRef, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoPlayer from "../../components/VideoPlayer";
import videoService from '../../services/videoService.js';
import VideoLikeButton from '../../../../shared/components/VideoLikeButton.jsx'
import DescriptionBox from '../../../../shared/components/DescriptionBox.jsx';
import CommentAndUpnext from './CommentAndUpnext.jsx';
import historyService from '../../../history/services/historyService.js';
import { Link } from 'react-router-dom';
import {Share2, MoreVertical} from 'lucide-react'
import formatNumber from '../../../../shared/utils/formatNumber.js';
import SubscribeButton from '../../../../shared/components/SubscribeButton.jsx';
import ShareVideoButton from '../../components/ShareVideoButton.jsx';

function Watch() {
const [video, setVideo] = useState(null);
const [searchParams] = useSearchParams();
const [isMediumScreen, setIsMediumScreen] = useState(window.innerWidth < 1536);
const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);
const publicId = searchParams.get("pi");
const videoId = searchParams.get("vi");

  useEffect(() => {
      const handleResize = () => {
        setIsMediumScreen(window.innerWidth < 1548);
        setIsSmallScreen(window.innerWidth < 640);
      };

      window.addEventListener('resize', handleResize);
      handleResize();

     return () => window.removeEventListener('resize', handleResize);
  }, []);

  const viewTimerRef = useRef(null);

   const onPlay = () => {
      if (viewTimerRef.current || !video?._id) return;
      
      const durationInSeconds = Number(video.duration);
      
      if (isNaN(durationInSeconds)) return;
      
      const waitTime = Math.max(5000, Math.min(durationInSeconds * 500, 30000));
      viewTimerRef.current = setTimeout(() => {
        videoService.incrementView(video._id)
          .catch((err) => console.error("Failed to increment view", err));
        
        historyService.addToWatchHistory(video._id)
          .catch((err) => console.error("Failed to add to watch history", err));
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
  }, [searchParams,videoId,publicId]);

  return (
    <div className="w-full h-full mx-auto mt-3 flex flex-row gap-x-[1px] items-stretch justify-center">
     
     {video 
     ? (
            <>
          {/* left container */}
          <div className={`h-full ${isMediumScreen?"w-full":"w-[60%]"} px-[4px] flex flex-col items-stretch  gap-y-[1px]`}>
            <div className="flex">
              <VideoPlayer publicId={publicId} onPlay={onPlay}/>
            </div>

          
            {/* video details */}
            <div className='text-white flex flex-col gap-y-[2px] items-stretch'>
                  <div className="text-xl pl-2">{video.title}</div>

                  <div className="flex justify-between items-start p-[10px]">
                        {/* Left box: channel details */}
                        <div className="flex items-center gap-x-[8px]">
                            
                          <div>
                              <img src={video.avatar}
                                  alt="avatar"
                                  className="w-10 h-10 rounded-full object-cover"
                              />
                          </div> 
                          <div className='flex flex-col items-start'>
                              <Link to={`/u/${video.username}`}><div className='text-base text-gray-300'>{video.username}</div></Link>
                              <div className="text-md text-gray-400">{formatNumber(video.subscribers)+" "}subscribers</div>
                          </div>
                          <div>
                            <SubscribeButton channelId={video.userId}
                              isSubscribed={video.isSubscribed}
                            />
                          </div>

                        </div>

                        {
                          !isSmallScreen && (
                            <div className="flex items-center justify-start space-x-2">
                                  <div className='flex justify-center items-center h-10 w-20 bg-gray-700 hover:bg-gray-500 rounded-2xl'>
                                    <VideoLikeButton key={video._id} isLiked={video.isLiked} likesCount={video.likesCount} videoId={video._id} />
                                  </div>
                                  <div className='flex justify-center items-center h-10 w-20 bg-gray-700 hover:bg-gray-500 rounded-2xl'>
                                    <ShareVideoButton videoUrl={window.location.href} className={"right-0"}/>
                                  </div>
                                  <div className='flex justify-center items-center h-10 w-20 bg-gray-700 hover:bg-gray-500 rounded-2xl'>
                                    <button><MoreVertical /></button>
                                  </div>
                            </div>
                          )
                        }
                  </div>
                  
                  {
                          isSmallScreen && (
                            <div className="flex items-center justify-start space-x-2">
                                  <div className='flex justify-center items-center h-10 w-16 bg-gray-700 hover:bg-gray-500 rounded-2xl'>
                                    <VideoLikeButton key={video._id} isLiked={video.isLiked} likesCount={video.likesCount} videoId={video._id} />
                                  </div>
                                  <div className='flex justify-center items-center h-10 w-20 bg-gray-700 hover:bg-gray-500 rounded-2xl'>
                                    <ShareVideoButton videoUrl={window.location.href} className={"left-0"} />
                                  </div>
                                  <div className='flex justify-center items-center h-10 w-16 bg-gray-700 hover:bg-gray-500 rounded-2xl'>
                                    <button><MoreVertical /></button>
                                  </div>
                            </div>
                          )
                        }

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
      {!isMediumScreen && (
        <div className='text-white w-[35%] h-full flex flex-col items-stretch space-y-2'>
           {video && (<CommentAndUpnext videoId={videoId} comment={true}/>)}
        </div>
      )}
    </div>
  );
}

export default Watch;
	