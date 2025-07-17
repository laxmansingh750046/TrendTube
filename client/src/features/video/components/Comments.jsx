import CommentsSection from '../../comment/pages/CommentsSection.jsx';

function Comments({videoId, commentRef=null}) {
  return (
    <div>
       <CommentsSection videoId={videoId} commentRef={commentRef} />
    </div>
  )
}

export default Comments
