import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';

// Components
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import HeroSequence from './components/HeroSequence';
import About from './components/About';
import Moments from './components/Moments';
import Performance from './components/Performance';
import TrophySection from './components/TrophySection';
import FinalSection from './components/FinalSection';

// Styles
import './App.css';

export default function App() {
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [isPreloadComplete, setIsPreloadComplete] = useState(false);
  const [isSequenceFinished, setIsSequenceFinished] = useState(false);
  
  // High-performance ref to avoid stale React closures inside Lenis animation cycle
  const isSequenceFinishedRef = useRef(false);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // luxurious easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // RequestAnimationFrame scroll loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Stop scrolling while loading or sequence is active
    if (!isPreloadComplete || !isSequenceFinished) {
      lenis.stop();
    } else {
      lenis.start();
    }

    return () => {
      lenis.destroy();
    };
  }, [isPreloadComplete, isSequenceFinished]);

  // Manage body overflow style to establish absolute unbreakable scroll lock
  useEffect(() => {
    if (!isPreloadComplete || !isSequenceFinished) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isPreloadComplete, isSequenceFinished]);

  // Track progress updates from the frame-engine preloader
  const handlePreloadProgress = (progress) => {
    setPreloadProgress(progress);
    if (progress >= 100) {
      // Small artificial timeout for cinematic loader fade transitions
      setTimeout(() => {
        setIsPreloadComplete(true);
      }, 800);
    }
  };

  const handleSequenceComplete = (completed) => {
    setIsSequenceFinished(completed);
    isSequenceFinishedRef.current = completed;
  };

  return (
    <div className="relative w-full min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
      
      {/* 1. Cinematic Loading Overlay */}
      <AnimatePresence mode="wait">
        {!isPreloadComplete && (
          <Loader progress={preloadProgress} />
        )}
      </AnimatePresence>

      {/* 2. Floating Cyber Navbar */}
      <Navbar />

      {/* 3. Immersive Main Page Sections */}
      <main className="relative w-full z-10">
        
        {/* HERO CANVAS SEQUENCE (strictly occupies h-screen when playing, unlocks naturally) */}
        <HeroSequence 
          isSequenceFinished={isSequenceFinished}
          onProgress={handlePreloadProgress} 
          onComplete={handleSequenceComplete} 
        />

        {/* Downstream editorial sections are conditionally mounted ONLY after the 191st frame is reached.
            This establishes an unbreakable scroll-lock by limiting the document scrollable height strictly 
            to the sequence range. */}
        {isSequenceFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
          >
            {/* ABOUT / RACING STORYTELLING */}
            <About />

            {/* RENDER CINEMATIC GALLERY */}
            <Moments />

            {/* PERFORMANCE telemetry meters */}
            <Performance />
            
            {/* HISTORICAL RECORDS & 360° Champions Trophy */}
            <TrophySection />

            {/* FINAL HERO CTA FOOTER */}
            <FinalSection />
          </motion.div>
        )}
        
      </main>
      
    </div>
  );
}
