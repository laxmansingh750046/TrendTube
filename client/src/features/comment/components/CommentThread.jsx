import React, { useState } from "react";
import CommentItem from "./CommentItem";
import CommentBox from "./CommentBox";
import CommentReplyBox from "./CommentReplyBox";

const CommentThread = ({ comment, getCommentReply,onReplySubmit, onLike }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showReply, setShowReply] = useState(false);
  
  const handleReply = (replyText) => {
    onReplySubmit(comment._id, replyText);
    setShowReplyBox(false);
  };
       
  return (
    <div className="mb-4">
      <CommentItem
        comment={comment}
        onLike={onLike}
        onReplyClick={() => setShowReplyBox(!showReplyBox)}
      />

      {showReplyBox && (
        <div className="ml-12 mt-2">
          <CommentBox onSubmit={handleReply} placeholder="Write a reply..." />
        </div>
      )}

      <button onClick={setShowReply(prev => !prev)}>Show Reply</button>
      
      {showReply && 
         <CommentReplyBox 
           commentId = {comment._id}
           getCommentReply = {commentService.getCommentReply}
         />
      }
    </div>
  );
};

export default CommentThread;
