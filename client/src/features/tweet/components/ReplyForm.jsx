import { useState } from 'react';

function ReplyForm({ onReplySubmit }) {
  const [text, setText] = useState('');

  const submitReply = () => {
    if (!text.trim()) return;
    onReplySubmit(text);
    setText('');
  };

  return (
    <div className="mt-2">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full border p-2 rounded"
        placeholder="Write a reply..."
        rows={2}
      />
      <button onClick={submitReply} className="bg-green-500 text-white px-3 py-1 mt-1 rounded">
        Reply
      </button>
    </div>
  );
}
export default ReplyForm;
