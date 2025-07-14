import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import playlistService from '../services/playlistServices.js';
import VideoCard from '../../video/components/VideoCard.jsx';
import Modal from '../components/Modal';

function PlaylistPage() {
  const [playlists, setPlaylists] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const response = await playlistService.getUserPlaylists();
        console.log("res",response);
        setPlaylists(response.data.data || []);
      } catch (error) {
        toast.error('Failed to load playlists');
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  const fetchPlaylistVideos = async (playlistId) => {
    try {
      setLoading(true);
      const response = await playlistService.getPlaylistVideos(playlistId);
      setVideos(response.data.data?.videos || []);
      setSelectedPlaylist(playlists.find(p => p._id === playlistId));
    } catch (error) {
      toast.error('Failed to load playlist videos');
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) {
      toast.error('Playlist name is required');
      return;
    }

    try {
      const response = await playlistService.createPlaylist({
        name: newPlaylistName,
        description: newPlaylistDescription
      });
      setPlaylists([...playlists, response.data.data]);
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setShowCreateModal(false);
      toast.success('Playlist created successfully');
    } catch (error) {
      toast.error('Failed to create playlist');
    }
  };

  const addToPlaylist = async (playlistId, videoId) => {
    try {
      await playlistService.addVideoToPlaylist(playlistId, videoId);
      toast.success('Video added to playlist');
      if (selectedPlaylist?._id === playlistId) {
        fetchPlaylistVideos(playlistId);
      }
    } catch (error) {
      toast.error('Failed to add video to playlist');
    }
  };
  
  const removeVideoFromPlaylist = async(playlistId, videoId) => {
    try {
      await playlistService.removeVideoFromPlaylist(playlistId, videoId);
      toast.success('Video removed from playlist');
      if (selectedPlaylist?._id === playlistId) {
        fetchPlaylistVideos(playlistId); 
      }
    } catch (error) {
      console.log(error);
      if(error.response?.data?.message)toast.error(error.response?.data?.message);
      else toast.error('Failed to remove video from playlist');
    }
  }
   
  const deletePlaylist = async(playlistId) => {
    try {
      await playlistService.deletePlaylist(playlistId);
      toast.success('Playlist deleted');
      setSelectedPlaylist(null)
      setVideos([]);
      setPlaylists(prev => prev.filter(p => p._id !== playlistId));
    } catch (error) {
      console.log(error);
      if(error.response?.data?.message)toast.error(error.response?.data?.message);
      else toast.error('Failed to delete playlist');
    } finally{
      setConfirmDelete(false);
    }
  }



  if (loading && !selectedPlaylist) {
    return (
       <div className="p-4 mt-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">
          {selectedPlaylist ? selectedPlaylist.name : 'Your Playlists'}
        </h1>
         <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Create Playlist
          </button>
      </div>
      </div>
    )
  }

  return (
    <div className="p-4 mt-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">
          {selectedPlaylist ? selectedPlaylist.name : 'Your Playlists'}
        </h1>
        {!selectedPlaylist && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Create Playlist
          </button>
        )}
        {selectedPlaylist && (
          <div className='flex gap-3'> 
            <button
            onClick={() => setSelectedPlaylist(null)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Back to Playlists
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
          </div>
        )}
      </div>
      {
        selectedPlaylist && confirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Delete Playlist
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Are you sure you want to delete the playlist "{selectedPlaylist.name}"? 
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deletePlaylist(selectedPlaylist._id)}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Delete Playlist
                </button>
              </div>
            </div>
          </div>
        )
      }
      {selectedPlaylist ? (
        <div>
          {videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p className="text-xl">No videos in this playlist yet</p>
              <p className="text-sm mt-2">Add videos to see them here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map(video => (
                <div key={video._id} className="relative group">
                  <VideoCard video={video} />
                  <button
                    onClick={() => removeVideoFromPlaylist(selectedPlaylist._id, video._id)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove from playlist"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlists.map(playlist => (
            <div
              key={playlist._id}
              className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700"
              onClick={() => fetchPlaylistVideos(playlist._id)}
            >
              <h3 className="text-xl font-semibold text-white">{playlist.name}</h3>
              <p className="text-gray-400 mt-2 line-clamp-2">
                {playlist.description || 'No description'}
              </p>
              <div className="mt-2 text-sm text-gray-500">
                {playlist.videos?.length || 0} videos
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Create New Playlist</h2>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Name</label>
            <input
              type="text"
              className="w-full bg-gray-700 text-white p-2 rounded"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Description (Optional)</label>
            <textarea
              className="w-full bg-gray-700 text-white p-2 rounded"
              rows="3"
              value={newPlaylistDescription}
              onChange={(e) => setNewPlaylistDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowCreateModal(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={createPlaylist}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default PlaylistPage;