import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function AuthPrompt({ closeMessageBox = null , headline, subtext, buttonText = "Sign in" }) {
  const [showMessage, setShowMessage] = useState(true);
  const navigate = useNavigate();
  const messageRef = useRef(null);

  const handleClickOutside = (e)=>{
    if(messageRef.current && !messageRef.current.contains(e.target)){
        setShowMessage(false);
        if(closeMessageBox)closeMessageBox();
    }
  }

  useEffect(()=>{
    if(showMessage) document.addEventListener('mousedown', handleClickOutside);
    return ()=>{document.removeEventListener('mousedown',handleClickOutside)};
  },[showMessage]);
  
  return (
    <>
    {showMessage && 
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div 
                ref = {messageRef}
                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg w-[90%] max-w-md text-center space-y-4">
                <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">
                {headline}
                </h2>
                <p className="text-base text-zinc-400">{subtext}</p>
                <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                {buttonText}
                </button>
            </div>
        </div>
    }
    </>
  );
}
