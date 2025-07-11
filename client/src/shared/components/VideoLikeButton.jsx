import { useState } from 'react';
import likeServices from '../../features/likes/likesServices/likesServices.js';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { useSelector } from "react-redux";
import AuthPrompt from '../../features/auth/components/AuthPrompt.jsx';


function VideoLikeButton({ isLiked: initialLiked, likesCount: initialCount, videoId }) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialCount);
  const [showLoggedInMessage, setShowLoggedInMessage] = useState(false);
  const isLoggedIn = useSelector(state => state.auth.status);

  const handleClick = async () => {
    if(!isLoggedIn){
    setShowLoggedInMessage(true);
    return;
  }
    const newLiked = !isLiked;
    setLikesCount((p) => p + (newLiked ? 1 : -1));
    setIsLiked(newLiked);

    try {
          await likeServices.onLikeVideo(videoId);
      } catch (err) {
          console.error("Like failed", err);
          // rollback UI state
          setLikesCount((p) => p + (newLiked ? -1 : 1));
          setIsLiked(!newLiked);
      }
    };


  return (
    <>
      {showLoggedInMessage &&
        <AuthPrompt 
          closeMessageBox={()=>setShowLoggedInMessage(false)}
          headline={"Like this video?"} 
          subtext ={"Sign in to make your opinion count."}
        />
      }
    <button
      onClick={handleClick}
      className="flex items-center space-x-1 text-gray-100 hover:text-blue-500 transition duration-150"
    >
      {isLiked ? (
        <AiFillLike className="text-3xl text-blue-600" />
      ) : (
        <AiOutlineLike className="text-3xl text-red-50" />
      )}
      {likesCount > 0 && <span className="text-xl font-medium">{likesCount}</span>}
    </button>
    </>
  );
}

export default VideoLikeButton;
