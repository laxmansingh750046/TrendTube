import React, { useState } from "react";
import Button from "../../../shared/components/Button.jsx";

const CommentBox = ({ onSubmit, actionType="comment", autoFocus = false }) => {
  const [text, setText] = useState("");

  const handelSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
  };

  return (
    <form onSubmit={handelSubmit} className="flex flex-col gap-2">
      <textarea
        className="w-full text-white text-xl bg-slate-900 p-2 border border-slate-600 rounded resize-none focus:outline-none focus:ring"
        rows="3"
        placeholder={actionType === "comment" ? "Add a comment..." : "Write a reply..."}
        value={text}
        autoFocus={autoFocus}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end">
        <Button type="submit" className="text-sm px-4 py-1">
          {actionType === "comment" ? "Comment" : "Reply"}
        </Button>
      </div>
    </form>
  );
};

export default CommentBox;
