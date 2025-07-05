import React, { Children } from 'react'
import VideoLibrary from '../video/pages/VideoLibrary'
import NavigationMenu from '../../shared/layout/NavigationMenu.jsx'

function Home() {
  return (
   <div className='h-[100%] w-[100%] flex'>
     <NavigationMenu />
     <div className='w-[90%] px-4'>
        <VideoLibrary>
          {Children}
        </VideoLibrary>
      </div>
   </div>
  )
}

export default Home
