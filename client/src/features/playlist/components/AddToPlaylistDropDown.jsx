import { useEffect, useState } from 'react';
import playlistService from '../api';

function AddToPlaylistDropdown({ userId, videoId }) {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    playlistService.getUserPlaylists(userId).then(res => {
      setPlaylists(res.data.playlists);
    });
  }, [userId]);

  const handleAdd = async (playlistId) => {
    await playlistService.addVideoToPlaylist(videoId, playlistId);
    alert("Added to playlist!");
  };

  return (
    <div className="relative">
      <select onChange={(e) => handleAdd(e.target.value)} className="border p-2 rounded">
        <option>Add to Playlist</option>
        {playlists.map(p => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>
    </div>
  );
}

export default AddToPlaylistDropdown;
