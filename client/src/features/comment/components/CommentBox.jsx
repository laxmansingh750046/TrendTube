import React, { useState } from "react";
import Button from "../../../shared/components/Button.jsx";

const CommentBox = ({ onSubmit, placeholder = "Add a comment...", autoFocus = false }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring"
        rows="3"
        placeholder={placeholder}
        value={text}
        autoFocus={autoFocus}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end">
        <Button type="submit" className="text-sm px-4 py-1">
          Comment
        </Button>
      </div>
    </form>
  );
};

export default CommentBox;
