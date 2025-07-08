import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const ChannelTabs = ({ username }) => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('videos');
    
    const tabs = [
        { id: 'videos', label: 'Videos' },
        { id: 'playlists', label: 'Playlists' },
        { id: 'about', label: 'About' }
    ];
    
    return (
        <div className="border-b border-gray-200">
            <div className="px-6 flex space-x-8">
                {tabs.map(tab => (
                    <Link
                        key={tab.id}
                        to={`/u/${username}/${tab.id}`}
                        className={`pb-3 px-1 ${
                            location.pathname.includes(tab.id)
                                ? 'border-b-2 border-black font-medium'
                                : 'text-gray-200 hover:text-gray-400'
                        }`}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>
        </div>
    );
};