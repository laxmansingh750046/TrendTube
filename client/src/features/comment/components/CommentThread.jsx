import { useState } from "react";
import CommentItem from "./CommentItem";
import CommentReplyContainer from "./CommentReplyContainer";

const CommentThread = ({comment}) => {
  const [showReply, setShowReply] = useState(false);

  return (
    <div className="mb-4 border-b border-gray-500 pb-4">
      <CommentItem
        comment={comment}
        onSuccess={()=>{}}
      />

      <div className="ml-[40%]">
        <button
          className="text-blue-400 text-2xl"
          onClick={() => setShowReply(prev => !prev)}
        >
          {showReply ? "▼" : "▲"}
          {comment.repliesCount > 0 && (
            <span className="text-xl">
              {comment.repliesCount} {comment.repliesCount === 1 ? "Reply" : "Replies"}
            </span>
          )}
        </button>
      </div>

      {showReply && 
         <CommentReplyContainer 
           commentId = {comment._id}
         />
      }
    </div>
  );
};

export default CommentThread;
