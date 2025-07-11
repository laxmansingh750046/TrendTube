import { useState } from "react";
import Button from "../../../shared/components/Button.jsx";
import AuthPrompt from "../../auth/components/AuthPrompt.jsx";
import {useSelector} from 'react-redux'

const CommentBox = ({ onSubmit, actionType="comment", autoFocus = false }) => {
  const [text, setText] = useState("");
  const [showLoggedInMessage, setShowLoggedInMessage] = useState(false);
  const isLoggedIn = useSelector(state => state.auth.status);
  // const 
  const handelSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
  };

  const openMessageBox = () => {
    if(isLoggedIn)return;
    setShowLoggedInMessage(true);
  }
  const closeMessageBox = ()=>{
    setShowLoggedInMessage(false);
  }

  return (
    <form onSubmit={handelSubmit} className="flex flex-col gap-2">
      <textarea
        className="w-full text-white text-xl bg-slate-900 p-2 border border-slate-600 rounded resize-none focus:outline-none focus:ring"
        rows="3"
        placeholder={actionType === "comment" ? "Add a comment..." : "Write a reply..."}
        value={text}
        autoFocus={autoFocus}
        onChange={(e) => setText(e.target.value)}
        onClick={openMessageBox}
      />
     {showLoggedInMessage &&  <AuthPrompt headline={"Want to join the conversation?"}
          subtext={"Sign in to continue"} closeMessageBox={closeMessageBox}
      />}
      <div className="flex justify-end">
        <Button type="submit" className="text-sm px-4 py-1">
          {"Submit"}
        </Button>
      </div>
    </form>
  );
};

export default CommentBox;
