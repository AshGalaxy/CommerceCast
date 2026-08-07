'use client';

import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-64 h-64 bg-primary/30 rounded-full blur-[80px]"
        />
      </div>
      
      {/* Logo container */}
      <div className="relative flex items-center justify-center">
        {/* Spinning glowing outer rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-60%] rounded-full border border-primary/10 border-t-primary/50 border-l-primary/30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-30%] rounded-full border border-primary/10 border-b-primary/50 border-r-primary/30"
        />
        
        {/* Breathing Logo */}
        <motion.div
          animate={{ scale: [0.96, 1.04, 0.96] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Logo className="w-14 h-14 text-primary drop-shadow-xl" />
        </motion.div>
      </div>
      
      {/* Optional tiny loading text */}
      <motion.div 
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 text-[10px] font-mono tracking-widest text-primary uppercase"
      >
        Initializing
      </motion.div>
    </div>
  );
}
