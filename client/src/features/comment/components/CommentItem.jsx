import React from "react";
import { formatTime } from "../../../shared/utils/formatTime.js";

const CommentItem = ({ comment, onLike, onReplyClick }) => {
  return (
    <div className="flex gap-3 mb-4">
      <img
        src={comment?.owner?.avatar || "/avatar.png"}
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="text-sm font-semibold">{comment.owner?.username}</div>
        <div className="text-sm text-gray-700">{comment.content}</div>
        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
          <span>{formatTime(comment.createdAt)}</span>
          <button onClick={() => onLike(comment._id)}>Like ({comment.likes?.length || 0})</button>
          <button onClick={() => onReplyClick(comment)}>Reply</button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
