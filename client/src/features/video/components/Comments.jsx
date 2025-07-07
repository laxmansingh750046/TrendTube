import CommentsSection from '../../comment/pages/CommentsSection.jsx';

function Comments({videoId}) {
  return (
    <div>
       <CommentsSection videoId={videoId}/>
    </div>
  )
}

export default Comments
