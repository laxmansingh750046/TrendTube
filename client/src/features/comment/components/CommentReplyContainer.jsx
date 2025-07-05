import React, { useState, useEffect, useCallback } from 'react';
import CommentItem from './CommentItem';
import commentService from '../api/index.js';

function CommentReplyContainer({ commentId }) {
  const [replies, setReplies] = useState([]);

  // define fetchReplies using useCallback so it stays the same across renders
  const fetchReplies = useCallback(async () => {
    try {
      const fetchedReplies = await commentService.getCommentReply(commentId);
      setReplies(fetchedReplies);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  }, [commentId]);

  useEffect(() => {
    fetchReplies();
  }, [fetchReplies]);

  return (
    <div>
      {replies?.length > 0 && (
        <div className="ml-12 mt-2">
          {replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onSuccess={fetchReplies} // now works as intended
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentReplyContainer;