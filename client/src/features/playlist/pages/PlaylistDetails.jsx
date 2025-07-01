import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import playlistService from '../api';

function PlaylistDetails() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);

  const fetchPlaylist = async () => {
    const res = await playlistService.getPlaylistById(playlistId);
    setPlaylist(res.data.playlist);
  };

  const handleRemove = async (videoId) => {
    await playlistService.removeVideoFromPlaylist(videoId, playlistId);
    fetchPlaylist();
  };

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);

  if (!playlist) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">{playlist.name}</h2>
      <p className="text-gray-600 mb-4">{playlist.description}</p>

      <ul className="space-y-3">
        {playlist.video.map(v => (
          <li key={v._id} className="flex justify-between items-center border p-3 rounded">
            <div>
              <p className="font-semibold">{v.title}</p>
            </div>
            <button onClick={() => handleRemove(v._id)} className="text-red-500 text-sm">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlaylistDetails;
