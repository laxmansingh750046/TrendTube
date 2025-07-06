import { useState } from "react";
import CommentItem from "./CommentItem";
import CommentReplyContainer from "./CommentReplyContainer";

const CommentThread = ({comment}) => {
  const [showReply, setShowReply] = useState(false);
  const [repliesCount,setRepliesCount] = useState(comment.repliesCount);
  const incrRepliesCount = ()=>{
    setRepliesCount(prev => prev+1);
  }
  return (
    <div className="mb-4 border-b border-gray-500 pb-4">
      <CommentItem
        comment={comment}
        onSuccess={()=>{}}
        onAddingNewReply = {incrRepliesCount}
      />

      <div className="ml-[40%]">
        <button
          className="text-blue-400 text-2xl"
          onClick={() => setShowReply(prev => !prev)}
        >
          {showReply ? "▼" : "▲"}
          {repliesCount > 0 && (
            <span className="text-xl">
              {repliesCount} {repliesCount === 1 ? "Reply" : "Replies"}
            </span>
          )}
        </button>
      </div>

      {showReply && 
         <CommentReplyContainer 
           commentId = {comment._id}
           onAddingNewReply = {incrRepliesCount}
           repliesCount = {repliesCount}
         />
      }
    </div>
  );
};

export default CommentThread;
