import { Share2, ClipboardCopy } from "lucide-react";
import { useState } from "react";
import { 
  FacebookIcon, 
  XIcon, 
  WhatsAppIcon, 
  LinkedInIcon 
} from "../../../shared/icons";

export default function ShareVideoButton({ videoUrl }) {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(videoUrl);

  const handleCopy = () => {
    navigator.clipboard.writeText(videoUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowOptions(false);
    }, 1500);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex justify-center items-center gap-1 h-10 w-20 px-4 bg-gray-700 hover:bg-gray-600 rounded-2xl transition-colors"
        aria-label="Share video"
      >
        <Share2 size={18} />
      </button>

      {showOptions && (
        <div className="absolute z-20 right-0 mt-2 bg-gray-800 border border-gray-600 shadow-lg p-3 rounded-lg w-48">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-300 mb-1">Share via</p>
            
            <div className="grid grid-cols-4 gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                aria-label="Share on WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>

              <a
                href={`https://twitter.com/intent/tweet?url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                aria-label="Share on Twitter"
              >
                <XIcon className="w-5 h-5" />
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                aria-label="Share on Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                aria-label="Share on LinkedIn"
              >
                <LinkedInIcon className="w-5 h-5" />
              </a>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 p-2 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors mt-2"
            >
              <ClipboardCopy size={16} />
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}