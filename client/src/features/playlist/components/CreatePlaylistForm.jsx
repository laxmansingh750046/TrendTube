import { useState } from 'react';
import playlistService from '../api/index.js';

function CreatePlaylistForm({ onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await playlistService.createPlaylist({ name, description });
    setName('');
    setDescription('');
    onCreated(); // Refresh list
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Playlist Name" required className="border p-2 w-full" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required className="border p-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
    </form>
  );
}

export default CreatePlaylistForm;
