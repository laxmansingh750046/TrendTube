import { useState, useEffect } from 'react';
import playlistService from '../services/playlistServices.js';
import { toast } from 'react-toastify';

function AddToPlaylist({ videoId, onClose = null, closePlaylistModal=null }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await playlistService.getUserPlaylists();
        setPlaylists(response.data.data || []);
      } catch (error) {
        toast.error('Failed to load playlists');
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await playlistService.addVideoToPlaylist(playlistId, videoId);
      toast.success('Added to playlist');
    } catch (error) {
      if(error?.response?.data?.message === "Video already in playlist")toast.error('Video already in playlist');
      else toast.error('Failed to add to playlist');
    } finally{
      if(onClose)onClose();
    }
  };

  return (
    <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold text-white mb-4">Add to Playlist</h3>
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {playlists.length === 0 ? (
                  <p className="text-gray-400">No playlists found</p>
                ) : (
                  <ul>
                    {playlists.map(playlist => (
                      <li key={playlist._id} className="mb-2">
                        <button
                          onClick={() => handleAddToPlaylist(playlist._id)}
                          className="w-full text-left p-2 hover:bg-gray-700 rounded text-white"
                        >
                          {playlist.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {if(closePlaylistModal)closePlaylistModal()}}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
    </>
  );
}

export default AddToPlaylist;