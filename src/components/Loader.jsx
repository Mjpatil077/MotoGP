import React from 'react';
import { motion } from 'framer-motion';
import bikerHelmet from '../assets/biker-helmet-neon-compressed.jpg';

export default function Loader({ progress }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
      }}
      className="fixed inset-0 w-full h-full bg-[#050505] z-[9999] flex flex-col justify-center items-center p-8 select-none overflow-hidden"
    >
      {/* Background Image - Subtle */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30 filter blur-sm scale-105 pointer-events-none transition-all duration-700"
        style={{ backgroundImage: `url(${bikerHelmet})` }}
      />
      
      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 w-full max-w-sm mx-auto">
        
        <div className="text-center">
          <span className="text-xs text-white/50 tracking-[0.2em] uppercase font-mono mb-2 block">
            Official Media
          </span>
          <h2 className="text-2xl font-display font-bold text-white tracking-widest uppercase">
            MOTOGP™
          </h2>
        </div>

        {/* Progress Display */}
        <div className="w-full flex flex-col items-center gap-4">
          <div className="text-5xl font-display font-light text-white">
            {progress}<span className="text-red-600 text-2xl font-bold">%</span>
          </div>
          
          <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-red-600" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

      </div>
    </motion.div>
  );
}
