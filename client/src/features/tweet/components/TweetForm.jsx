import { useState } from 'react';

function TweetForm({ onSubmit }) {
  const [content, setContent] = useState('');

  const handlePost = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent('');
  };

  return (
    <div className="mb-4">
      <textarea
        className="border w-full p-2 rounded"
        rows={3}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What's happening?"
      />
      <button onClick={handlePost} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
        Tweet
      </button>
    </div>
  );
}
export default TweetForm;
