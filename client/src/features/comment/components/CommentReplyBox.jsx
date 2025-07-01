import React, {useState, useEffect} from 'react'
import CommentItem from './CommentItem';

function CommentReplyBox({commentId, getCommentReply}) {
  const [replies, setReplies] = useState([]);
  useEffect(()=>{
    const fetchReplies = async ()=>{
        try {
        const fetchedReplies = await getCommentReply(commentId);
        setReplies(fetchedReplies);
      } catch (error) {
        console.error('Error fetching replies:', error);
      }
    }
    fetchReplies();
  }, [])
  return (
    <div>
      {replies?.length > 0 && (
        <div className="ml-12 mt-2">
          {replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onLike={onLike}
              onReplyClick={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentReplyBox
