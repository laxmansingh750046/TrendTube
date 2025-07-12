import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { RouterProvider, createBrowserRouter, Navigate} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/index.js';

import Home from './features/home/Home.jsx';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import TweetFeed from './features/tweet/pages/TweetFeed';
import TweetDetails from './features/tweet/pages/TweetDetails';
import LikedVideos from './features/likes/page/LikedVideos.jsx'
import Watch from './features/video/pages/watch/Watch.jsx';
import VideoPlayer from './features/video/components/VideoPlayer.jsx';
import UploadVideo from './features/video/pages/uploadVideo/UploadVideo.jsx'
import VideoDetail from './features/video/pages/VideoDetail';
import ChannelPage from './features/user/pages/ChannelPage';
import EditProfile from './features/user/pages/EditProfile';
import WatchHistoryPage from './features/history/pages/WatchHistory.jsx'; 
import AuthLayout from './shared/layout/AuthLayout.jsx'
import About from './features/about/About.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element:  <Home /> },
      { path: '/login',  element:<AuthLayout authentication={false}> <Login /> </AuthLayout>},
      { path: '/register', element:<AuthLayout authentication={false}> <Register /> </AuthLayout>},
      { path: '/watch', element: <Watch />},
      { path: '/upload', element: <AuthLayout authentication={true}> <UploadVideo /> </AuthLayout> },
      { path: '/playvideo', element: <AuthLayout authentication={true}> <VideoPlayer /> </AuthLayout> },
      { path: 'feed', element: <AuthLayout authentication={true}> <TweetFeed /> </AuthLayout> },
      { path: 'tweet/:id', element: <AuthLayout authentication={true}> <TweetDetails /> </AuthLayout> },
      { path: 'video/:videoId', element: <AuthLayout authentication={true}> <VideoDetail /> </AuthLayout> },
      { path: 'u/:username', element: <Navigate to="videos" replace /> },
      { path: 'u/:username/:tab?', element:  <ChannelPage /> },
      { path: 'channel/edit', element: <AuthLayout authentication={true}> <EditProfile /> </AuthLayout> },
      { path: 'history', element: <AuthLayout authentication={true}> <WatchHistoryPage /> </AuthLayout> },
      { path: '/about', element: <About />},
      { path: '/liked-videos', element: <LikedVideos />},
    ]
  }
]);


createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  // </StrictMode>
);
