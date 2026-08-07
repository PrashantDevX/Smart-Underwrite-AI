import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <motion.div
          className="inline-block"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
        </motion.div>
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}
