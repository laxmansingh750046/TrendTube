import React, { useEffect, useState, useRef } from 'react';
import CommentList from '../components/CommentList';
import commentService from '../api/index.js';

function CommentsSection({ videoId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await commentService.getVideoComments(videoId, page);
        if(res.data?.comments.length === 0)setHasMore(false);
        if (res.data?.comments) setComments(prev => ([...prev, ...res.data.comments])); 
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchComments();
    }
  }, [page, videoId]);

  useEffect(()=>{
    const observer = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMore){
        setPage(prev => prev+1);
      }
    });

    if(observerRef.current) observer.observe(observerRef.current);

    return ()=>{
      if(observerRef.current) observer.unobserve(observerRef.current);
    }
  },[hasMore]);

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <CommentList 
        comments={comments}
        getCommentReply = {commentService.getCommentReply}
        onReplySubmit={commentService.onReplySubmit}
        onLike={commentService.onLike}
      />
      {hasMore && <div ref={observerRef}></div>}
    </div>
  );
}

export default CommentsSection;
