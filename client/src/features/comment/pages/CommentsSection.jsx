import React, { useEffect, useState, useRef } from 'react';
import CommentList from '../components/CommentList';
import commentService from '../api/index.js';
import CommentBox from '../components/CommentBox.jsx';


function CommentsSection({ videoId }) {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const limit = 10; 
  
  const handelComment = async (text)=>{
    try {
     const newComment = await commentService.onCommentSubmit(videoId, text);
      setPage(1);
      setHasMore(true);
      setComments([]);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await commentService.getVideoComments(videoId, page);
        if(res.data?.comments?.length < limit)setHasMore(false);
        if (res.data?.comments) setComments(prev => ([...prev, ...res.data.comments])); 
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load comments");
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

  
  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      {/* //comment here */}
      <div>
        <CommentBox onSubmit={handelComment} />
      </div>
      <CommentList 
        comments={comments}
      />
      {hasMore && <div ref={observerRef}></div>}
    </div>
  );
}

export default CommentsSection;
