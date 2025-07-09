import { useEffect, useState } from 'react';
import { useParams, Routes, Route, Navigate } from 'react-router-dom';
import { ChannelHeader } from '../components/ChannelHeader.jsx';
import { ChannelTabs } from '../components/ChannelTabs.jsx';
import VideoGrid from '../components/VideoGrid.jsx';
import userService from '../services/userService.js';
import { Spinner } from '../components/Spinner.jsx';

const ChannelPage = () => {
    const { username, tab } = useParams();
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const channelRes = await userService.getChannelByUsername(username);
                setChannel(channelRes.data.data);
                
                if (tab === 'videos' || !tab) {
                    const videosRes = await userService.getChannelVideos(username);
                    setVideos(videosRes.data.data.docs);
                }
            } catch (error) {
                console.error('Error fetching channel data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [username, tab]);
    
    if (loading) return (
        <div className='h-full w-full flex justify-center items-center bg-slate-900'>
            <Spinner size={50} className="text-blue-500" />
        </div>
    );
    
    if (!channel) return (
        <div className='text-slate-300 text-3xl text-center h-[30vh] bg-slate-900 flex items-center justify-center'>
            Channel not found
        </div>
    );
    
    return (
        <div className="bg-slate-900 min-h-screen text-slate-100">
            <ChannelHeader channel={channel} />
            <ChannelTabs username={username} activeTab={tab} />
            
            <div className="p-6">
                {/* Remove Routes wrapper since we're already in a route */}
                {(!tab || tab === 'videos') && <VideoGrid videos={videos} />}
                {tab === 'playlists' && <PlaylistsTab channelId={channel._id} />}
                {tab === 'about' && <AboutTab channel={channel} />}
            </div>
        </div>
    );
};

const PlaylistsTab = ({ channelId }) => {
    return (
        <div className="text-gray-100">
            Playlists will be shown here
        </div>
    );
};

const AboutTab = ({ channel }) => {
    return (
        <div className="max-w-3xl text-slate-300">
            <h2 className="text-xl font-bold mb-4">About {channel.fullName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Stats</h3>
                    <p className="text-slate-400">Joined: {new Date(channel.createdAt).toLocaleDateString()}</p>
                    <p className="text-slate-400">Subscribers: {channel.subscribersCount}</p>
                    <p className="text-slate-400">Videos: {channel.videoCount}</p>
                </div>
                <div className="md:col-span-2 bg-slate-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="text-slate-400">
                        {channel.description || "No description provided."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChannelPage;