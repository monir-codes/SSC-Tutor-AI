import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';

const messages = [
  "📖 Preparing your learning experience...",
  "🧠 AI is thinking...",
  "✨ Organizing the best explanation...",
  "📚 Loading chapters...",
  "🎯 Getting practice questions ready...",
  "🚀 Almost there...",
  "💡 Making learning easier..."
];

interface GlobalLoaderProps {
  isLoading: boolean;
  message?: string;
  type?: 'global' | 'ai';
}

export function GlobalLoader({ isLoading, message, type = 'global' }: GlobalLoaderProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [isLoading]);

  const displayMessage = message || (type === 'ai' ? "AI is analyzing your question..." : messages[messageIndex]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md"
        >
          <div className="relative flex flex-col items-center">
            {/* Glowing effect behind */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary-500/30 dark:bg-primary-500/20 rounded-full blur-3xl pointer-events-none"
            />
            
            <div className="relative">
              <motion.div
                animate={{ 
                  rotateY: [0, 180, 360],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-20 h-20 bg-primary-100 dark:bg-primary-900/50 rounded-2xl flex items-center justify-center shadow-lg border border-primary-200 dark:border-primary-800 relative z-10"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <BookOpen className="h-10 w-10 text-primary-600 dark:text-primary-400" />
              </motion.div>
              
              {/* Particles */}
              <motion.div
                animate={{ y: [-10, -30], opacity: [0, 1, 0], x: [-10, -20] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                className="absolute top-0 left-0"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
              </motion.div>
              <motion.div
                animate={{ y: [-10, -40], opacity: [0, 1, 0], x: [10, 30] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
                className="absolute top-0 right-0"
              >
                <Sparkles className="h-5 w-5 text-blue-400" />
              </motion.div>
            </div>

            <h2 className="mt-8 text-2xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-blue-400 font-sans tracking-tight">
              SSC Tutor AI
            </h2>

            <div className="mt-4 h-6 overflow-hidden relative w-64 text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={displayMessage}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-slate-600 dark:text-slate-400 font-medium absolute inset-x-0"
                >
                  {displayMessage}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 w-48 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary-600 dark:bg-primary-500 rounded-full"
                animate={{
                  x: ["-100%", "100%"]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
