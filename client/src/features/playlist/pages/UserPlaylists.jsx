import { useEffect, useState } from 'react';
import playlistService from '../api';
import CreatePlaylistForm from './CreatePlaylistForm';
import { Link } from 'react-router-dom';

function UserPlaylists({ userId }) {
  const [playlists, setPlaylists] = useState([]);

  const fetchPlaylists = async () => {
    const res = await playlistService.getUserPlaylists(userId);
    setPlaylists(res.data.playlists);
  };

  useEffect(() => {
    fetchPlaylists();
  }, [userId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Playlists</h2>
      <CreatePlaylistForm onCreated={fetchPlaylists} />
      <ul className="mt-4 space-y-2">
        {playlists.map(p => (
          <li key={p._id} className="border p-3 rounded hover:bg-gray-100">
            <Link to={`/playlist/${p._id}`}>
              <strong>{p.name}</strong> <br />
              <span className="text-sm text-gray-600">{p.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserPlaylists;
