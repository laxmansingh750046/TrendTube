import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";

// Typewriter effect hook for dynamic text
const useTypewriter = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState("");
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
      }
    }, speed);
    return () => clearInterval(typing);
  }, [text, speed]);
  return displayText;
};

export default function LoadOverLay({ loading, children, theme = "light" }) {
  const shouldReduceMotion = useReducedMotion();
  const typedText = useTypewriter("loading...", 100);

  // Mock progress (replace with actual progress from your backend)
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [loading]);

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0.7, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0.7,
      scale: 0.95,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.2,
      },
    },
  };

  const spinnerVariants = {
    animate: {
      rotate: shouldReduceMotion ? 0 : 360,
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: shouldReduceMotion ? 1 : [1, 1.1, 1],
      opacity: shouldReduceMotion ? 1 : [0.7, 1, 0.7],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative">
      {loading && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`absolute inset-0 z-20 ${
            theme === "dark"
              ? "bg-gray-900/80 backdrop-blur-md"
              : "bg-white/70 backdrop-blur-sm"
          } flex items-center justify-center`}
          role="alert"
          aria-live="assertive"
          aria-label="File loading in progress"
        >
          <div className="flex flex-col items-center gap-4">
            {/* Progress Ring */}
            <div className="relative w-16 h-16">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className={`${
                    theme === "dark" ? "stroke-gray-700" : "stroke-gray-200"
                  }`}
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="8"
                  fill="none"
                />
                <motion.circle
                  className="stroke-blue-500"
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - progress / 100)}
                  strokeLinecap="round"
                  variants={spinnerVariants}
                  animate="animate"
                />
              </svg>
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                variants={pulseVariants}
                animate="animate"
              >
                <div
                  className={`w-8 h-8 rounded-full ${
                    theme === "dark" ? "bg-blue-400" : "bg-blue-500"
                  }`}
                ></div>
              </motion.div>
            </div>
            {/* loading Text */}
            <motion.p
              className={`text-lg font-medium ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: shouldReduceMotion ? 0 : 0.3 }}
            >
              {typedText}
              <span className="animate-pulse">|</span>
            </motion.p>
            {/* Progress Percentage */}
            <motion.p
              className={`text-sm ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: shouldReduceMotion ? 0 : 0.3 }}
            >
              {progress}% Complete
            </motion.p>
          </div>
        </motion.div>
      )}
      <div
        className={`transition-opacity duration-300 ${
          loading ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </div>
  );
}