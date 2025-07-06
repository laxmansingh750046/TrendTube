import React from 'react'
import CommentsSection from '../../../comment/pages/CommentsSection';

function Comments({videoId}) {
  return (
    <div>
       <CommentsSection videoId={videoId}/>
    </div>
  )
}

export default Comments
