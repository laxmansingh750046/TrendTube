import React, { Children } from 'react'
import VideoLibrary from '../video/pages/VideoLibrary'

function Home() {
  return (
     <div className='w-full h-full'>
        <VideoLibrary>
          {Children}
        </VideoLibrary>
      </div>
  )
}

export default Home
