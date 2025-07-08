import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export const Spinner = ({ size = 24, className = "" }) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
      className={`inline-block ${className}`}
    >
      <Loader2 size={size} className="text-blue-700" />
    </motion.div>
  );
};