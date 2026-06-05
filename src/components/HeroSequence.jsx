import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RACE_FRAMES } from '@/lib/race-frames';
import { ChevronDown } from 'lucide-react';
import bikerHelmet from '../assets/biker-helmet-neon-compressed.jpg';

export default function HeroSequence({ isSequenceFinished, onProgress, onComplete }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  const isFinishedRef = useRef(isSequenceFinished);
  useEffect(() => {
    isFinishedRef.current = isSequenceFinished;
  }, [isSequenceFinished]);
  
  // High performance refs to avoid React re-render lag
  const stateRef = useRef({
    images: [],
    loadedCount: 0,
    targetFrame: 0,
    currentFrame: 0,
    scrollProgress: 0,
    isFirstImageLoaded: false,
    bikerHelmetImage: null,
    activeSection: 0,
    hasCompleted: false
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isFirstFrameReady, setIsFirstFrameReady] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  // Preload initial frames first, then lazy load the rest
  useEffect(() => {
    let active = true;
    const totalFrames = RACE_FRAMES.length;
    const preloadTarget = Math.min(35, totalFrames);
    const state = stateRef.current;
    
    state.images = Array(totalFrames).fill(null);

    const bikerImg = new Image();
    bikerImg.src = bikerHelmet;
    bikerImg.onload = () => {
      if (active) state.bikerHelmetImage = bikerImg;
    };

    const loadImage = (index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = RACE_FRAMES[index];
        img.onload = () => {
          if (!active) return;
          state.images[index] = img;
          state.loadedCount++;
          
          const progressPercent = Math.min(
            100, 
            Math.round((state.loadedCount / preloadTarget) * 100)
          );
          
          if (index === 0) {
            state.isFirstImageLoaded = true;
            setIsFirstFrameReady(true);
          }
          
          if (state.loadedCount >= preloadTarget && isLoading) {
            setIsLoading(false);
            if (onProgress) onProgress(100);
          } else {
            if (onProgress) onProgress(Math.min(99, progressPercent));
          }
          resolve();
        };
        img.onerror = () => {
          resolve(); 
        };
      });
    };

    async function preloadInitial() {
      const promises = [];
      for (let i = 0; i < preloadTarget; i++) {
        promises.push(loadImage(i));
      }
      await Promise.all(promises);
      
      if (active) {
        for (let i = preloadTarget; i < totalFrames; i++) {
          await new Promise((r) => setTimeout(r, 15));
          loadImage(i);
        }
      }
    }

    preloadInitial();

    return () => {
      active = false;
    };
  }, []);

  // Scroll lock and frame targeting
  useEffect(() => {
    if (isSequenceFinished) return;

    const handleWheel = (e) => {
      const state = stateRef.current;
      const totalFrames = RACE_FRAMES.length;

      if (state.targetFrame >= totalFrames - 1 && e.deltaY > 0) {
        if (!state.hasCompleted) {
          state.hasCompleted = true;
          if (onComplete) onComplete(true);
        }
        return; 
      }

      e.preventDefault();
      const frameDelta = e.deltaY * 0.18;
      
      state.targetFrame = Math.min(
        totalFrames - 1,
        Math.max(0, state.targetFrame + frameDelta)
      );

      if (state.targetFrame >= totalFrames - 1 && !state.hasCompleted) {
        state.hasCompleted = true;
        if (onComplete) onComplete(true);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const state = stateRef.current;
      const totalFrames = RACE_FRAMES.length;
      const touchY = e.touches[0].clientY;
      const diffY = touchStartY - touchY;
      touchStartY = touchY;

      if (state.targetFrame >= totalFrames - 1 && diffY > 0) {
        if (!state.hasCompleted) {
          state.hasCompleted = true;
          if (onComplete) onComplete(true);
        }
        return;
      }

      if (e.cancelable) {
        e.preventDefault();
      }

      const frameDelta = diffY * 0.45;
      state.targetFrame = Math.min(
        totalFrames - 1,
        Math.max(0, state.targetFrame + frameDelta)
      );

      if (state.targetFrame >= totalFrames - 1 && !state.hasCompleted) {
        state.hasCompleted = true;
        if (onComplete) onComplete(true);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isSequenceFinished]);

  // Main Canvas Render Loop
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const renderLoop = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      ctx.clearRect(0, 0, w, h);
      
      const totalFrames = RACE_FRAMES.length;
      if (isFinishedRef.current) {
        state.currentFrame += 0.35; // smooth slow-motion looping
        if (state.currentFrame >= totalFrames) {
          state.currentFrame = totalFrames - 40; // loop back to the start of the last 40 frames
        }
      } else {
        state.currentFrame += (state.targetFrame - state.currentFrame) * 0.1;
      }
      const currentFrameRounded = Math.round(state.currentFrame);
      const progress = state.currentFrame / (totalFrames - 1);
      state.scrollProgress = progress;
      
      let img = state.images[currentFrameRounded];
      
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let i = currentFrameRounded; i >= 0; i--) {
          if (state.images[i] && state.images[i].complete && state.images[i].naturalWidth !== 0) {
            img = state.images[i];
            break;
          }
        }
      }

      if (!img || !img.complete || img.naturalWidth === 0) {
        img = state.bikerHelmetImage;
      }

      if (img && img.complete && img.naturalWidth !== 0) {
        const imgRatio = img.width / img.height;
        const screenRatio = w / h;
        let drawW, drawH, drawX, drawY;
        
        if (imgRatio > screenRatio) {
          drawH = h;
          drawW = h * imgRatio;
          drawX = (w - drawW) / 2;
          drawY = 0;
        } else {
          drawW = w;
          drawH = w / imgRatio;
          drawX = 0;
          drawY = (h - drawH) / 2;
        }
        
        ctx.save();
        ctx.globalAlpha = 1.0;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();
      }

      let activeSec = 0;
      if (isFinishedRef.current) {
        activeSec = 3;
      } else if (progress >= 0.88) {
        activeSec = 3;
      } else if (progress >= 0.68) {
        activeSec = 2;
      } else if (progress >= 0.28) {
        activeSec = 1;
      }
      
      if (state.activeSection !== activeSec) {
        state.activeSection = activeSec;
        setActiveSection(activeSec);
      }

      if (currentFrameRounded >= totalFrames - 1 && !state.hasCompleted) {
        state.hasCompleted = true;
        if (onComplete) onComplete(true);
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isLoading]);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden z-20 bg-black">
      <div className="absolute top-0 left-0 w-full h-full">
        
        <AnimatePresence>
          {!isFirstFrameReady && (
            <motion.img 
              src={bikerHelmet} 
              alt="MotoGP Rider"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute top-0 left-0 w-full h-full object-cover z-30 pointer-events-none"
            />
          )}
        </AnimatePresence>

        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full block object-cover" />
        
        {/* Soft editorial gradient overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-black pointer-events-none z-10 opacity-60" />

        {/* Clean Editorial Typography */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between p-4 sm:p-6 md:p-12 lg:p-16 pointer-events-none z-30">
          
          <div />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-5xl px-4 pointer-events-none z-40">
            <AnimatePresence mode="wait">
              {activeSection === 0 && (
                <motion.div
                  key="sec0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center gap-4 w-full"
                >
                  <span className="text-red-600 font-mono text-xs tracking-[0.2em] font-medium uppercase">
                    The Pinnacle of Racing
                  </span>
                  <h1 className="text-[clamp(1.8rem,7vw,3.2rem)] md:text-[clamp(3.5rem,8vw,6rem)] lg:text-8xl font-display font-light leading-[0.95] text-white drop-shadow-xl">
                    PURE<br />
                    <span className="font-bold text-white">ADRENALINE.</span>
                  </h1>
                </motion.div>
              )}

              {activeSection === 1 && (
                <motion.div
                  key="sec1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center gap-4 w-full"
                >
                  <span className="text-white/50 font-mono text-xs tracking-[0.2em] font-medium uppercase">
                    Unmatched Velocity
                  </span>
                  <h2 className="text-[clamp(1.6rem,7vw,3rem)] md:text-[clamp(3rem,8vw,5rem)] lg:text-7xl font-display font-light leading-[0.95] text-white drop-shadow-xl">
                    BEYOND<br />
                    <span className="font-bold text-white">LIMITS.</span>
                  </h2>
                </motion.div>
              )}

              {activeSection === 2 && (
                <motion.div
                  key="sec2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center gap-4 w-full"
                >
                   <span className="text-white/50 font-mono text-xs tracking-[0.2em] font-medium uppercase">
                    Precision Engineering
                  </span>
                  <h2 className="text-[clamp(1.6rem,7vw,3rem)] md:text-[clamp(3rem,8vw,5rem)] lg:text-7xl font-display font-light leading-[0.95] text-white drop-shadow-xl">
                    ABSOLUTE<br />
                    <span className="font-bold text-white">CONTROL.</span>
                  </h2>
                </motion.div>
              )}

              {activeSection === 3 && (
                <motion.div
                  key="sec3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center gap-4 w-full"
                >
                  <h2 className="text-[clamp(2rem,9vw,3.8rem)] md:text-[clamp(3.5rem,9vw,6rem)] lg:text-8xl font-display font-bold leading-[0.95] text-white drop-shadow-xl">
                    WELCOME.
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Minimal Scroll Indicator */}
        <AnimatePresence>
          {!isSequenceFinished && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 z-40 pointer-events-none"
            >
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase">Scroll</span>
              <ChevronDown size={16} className="text-white/50 animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
