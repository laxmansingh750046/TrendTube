import React from "react";
import CommentThread from "./CommentThread";

const CommentList = ({ comments = [], getCommentReply, onReplySubmit, onLike }) => {
  return (
    <div className="mt-4">
      {comments.map((comment) => (
        <CommentThread
          key={comment._id}
          comment={comment}
          getCommentReply = {commentService.getCommentReply}
          onReplySubmit={onReplySubmit}
          onLike={onLike}
        />
      ))}
    </div>
  );
};

export default CommentList;
