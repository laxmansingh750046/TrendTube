import React, { Children } from 'react'
import VideoLibrary from '../video/pages/VideoLibrary'

function Home() {
  return (
     <div className='w-[90%] px-4'>
        <VideoLibrary>
          {Children}
        </VideoLibrary>
      </div>
  )
}

export default Home
