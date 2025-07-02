import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/index.js';


import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import TweetFeed from './features/tweet/pages/TweetFeed';
import TweetDetails from './features/tweet/pages/TweetDetails';
import VideoLibrary from './features/video/pages/VideoLibrary';
import UploadVideo from './features/video/pages/uploadVideo/UploadVideo.jsx'
import VideoDetail from './features/video/pages/VideoDetail';
import ChannelPage from './features/user/pages/ChannelPage';
import EditProfile from './features/user/pages/EditProfile';
import WatchHistoryPage from './features/history/pages/WatchHistory.jsx'; 
import AuthLayout from './shared/layout/AuthLayout.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <AuthLayout authentication={false}> <VideoLibrary /> </AuthLayout> },
      { path: '/login',  element:<AuthLayout authentication={false}> <Login /> </AuthLayout>},
      { path: '/register', element:<AuthLayout authentication={false}> <Register /> </AuthLayout>},
      { path: '/upload', element: <AuthLayout authentication={true}> <UploadVideo /> </AuthLayout> },
      { path: 'feed', element: <AuthLayout authentication={true}> <TweetFeed /> </AuthLayout> },
      { path: 'tweet/:id', element: <AuthLayout authentication={true}> <TweetDetails /> </AuthLayout> },
      { path: 'video/:videoId', element: <AuthLayout authentication={true}> <VideoDetail /> </AuthLayout> },
      { path: 'u/:username', element: <AuthLayout authentication={true}> <ChannelPage /> </AuthLayout> },
      { path: 'channel/edit', element: <AuthLayout authentication={true}> <EditProfile /> </AuthLayout> },
      { path: 'history', element: <AuthLayout authentication={true}> <WatchHistoryPage /> </AuthLayout> },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
