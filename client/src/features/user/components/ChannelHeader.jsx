import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import Button from '../../../shared/components/Button.jsx';
import SubscribeButton from '../../../shared/components/SubscribeButton.jsx';

export const ChannelHeader = ({ channel }) => {
    // Get auth status from Redux store
    const isLoggedIn = useSelector((state) => state.auth.status);
    const isOwner = channel?.isOwner;
    const navigate = useNavigate();

    return (
        <div className="relative">
            {/* Cover Image */}
            <div className="h-48 w-full bg-gray-200 relative">
                {channel.coverImage && (
                    <img 
                        src={channel.coverImage} 
                        alt="Cover" 
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
            
            {/* Channel Info */}
            <div className="px-6 py-4 flex flex-col md:flex-row items-start md:items-center">
                <div className="relative -mt-16 md:-mt-12">
                    <div className="w-32 h-32 rounded-full bg-white border-4 border-white overflow-hidden">
                        {channel.avatar && (<img 
                            src={channel.avatar} 
                            alt={channel.username}
                            className="w-full h-full object-cover"
                        />)}
                    </div>
                </div>
                
                <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">{channel.fullName}</h1>
                            <p className="text-gray-100">@{channel.username}</p>
                        </div>
                        
                        {!isOwner && isLoggedIn && (
                            <SubscribeButton 
                                channelId={channel._id} 
                                isSubscribed={channel.isSubscribed} 
                            />
                        )}
                        
                        {isOwner && (
                            <Button variant="outline" className="mt-2 md:mt-0"
                               onClick={()=>navigate('/channel/edit')}
                            >
                                Customize Channel
                            </Button>
                        )}
                    </div>
                    
                    <div className="mt-4 flex space-x-6">
                        <div>
                            <span className="font-bold text-white text-xl">{channel.subscribersCount}</span>
                            <span className="text-gray-300 ml-1">subscribers</span>
                        </div>
                        <div>
                            <span className="font-bold text-white text-xl">{channel.videoCount}</span>
                            <span className="text-gray-300 ml-1">videos</span>
                        </div>
                        <div>
                            <span className="font-bold text-white text-xl">{channel.playlistCount}</span>
                            <span className="text-gray-300 ml-1">playlists</span>
                        </div>
                    </div>
                    
                    <p className="mt-2 text-gray-300">
                        Joined: {new Date(channel.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
};