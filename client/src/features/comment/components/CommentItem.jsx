import React, { useState } from "react";
import CommentBox from "./CommentBox.jsx";
import { formatTime } from "../../../shared/utils/formatTime.js";
import commentService from "../api/index.js";
import LikeButton from "../../../shared/components/LikeButton.jsx";

const CommentItem = ({ comment, onSuccess }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const toggleReplyBox = () => {
    setShowReplyBox(prev => !prev);
  };

  const handleReply = async (replyText) => {
    await commentService.onReplySubmit(comment._id, replyText);
    setShowReplyBox(false);
    onSuccess();
  };

  return (
    <div className="pb-1">
      <div className="flex gap-3 mb-2">
        {/* Avatar */}
        <img
          src={comment?.ownerInfo?.profilePicture}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />

        {/* Content */}
        <div className="flex-1 text-base">
          <div className="flex items-center gap-2 font-semibold text-white">
            <span>@{comment.ownerInfo?.username}</span>
            <span className="text-gray-400 font-normal">
              {formatTime(comment.createdAt)}
            </span>
          </div>

          {/* Comment text */}
          <div className="text-xl text-white mt-1 mb-2">
            {comment.content}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 text-base text-gray-50">
            <LikeButton 
              key={comment._id}
              isLiked = {comment.isLiked}
              likesCount = {comment.likesCount}
              commentId={comment._id}
            />
            <button onClick={toggleReplyBox}>Reply</button>
          </div>

          {/* Reply box */}
          {showReplyBox && (
            <div className="ml-10 mt-3">
              <CommentBox onSubmit={handleReply} actionType="reply" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
