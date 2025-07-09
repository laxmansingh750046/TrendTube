import {useState} from 'react'
import Comments from '../../components/Comments.jsx';
import UpNext from '../../components/UpNext.jsx';

export default function CommentAndUpnext({videoId, comment=false}) {
  const [swap, setSwap] = useState(comment);

  return (
    <>
     <div className="flex items-center justify-center my-3">
          <button
            onClick={()=> setSwap(p=>!p)}
            className="px-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            <span>
              {swap ? "Up Next" : "Comments"}
            </span>
          </button>
        </div>

        <div>
          {swap ? <Comments key={videoId+"rcom"} videoId={videoId} /> : <UpNext key={videoId+"rUp"} />}
        </div>
    </>
  )
}


