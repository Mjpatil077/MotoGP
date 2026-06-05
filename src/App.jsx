import { useEffect, useState, useRef } from 'react';
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
import TrackDetail from './components/TrackDetail';
import RiderDetail from './components/RiderDetail';
import CalendarPreview from './components/CalendarPreview';
import CalendarPage from './components/CalendarPage';
import TeamsSection from './components/TeamsSection';

// Styles
import './App.css';

export default function App() {
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [isPreloadComplete, setIsPreloadComplete] = useState(false);
  const [isSequenceFinished, setIsSequenceFinished] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);
  const [currentView, setCurrentView] = useState(window.location.pathname === '/calendar' ? 'calendar' : 'home');

  // High-performance ref to avoid stale React closures inside Lenis animation cycle
  const isSequenceFinishedRef = useRef(false);
  const lenisRef = useRef(null);

  useEffect(() => {
    const handleLocationChange = () => {
      const isCal = window.location.pathname === '/calendar';
      setCurrentView(isCal ? 'calendar' : 'home');
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

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

    lenisRef.current = lenis;

    // RequestAnimationFrame scroll loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Stop scrolling only while loading or sequence is active
    if (!isPreloadComplete || !isSequenceFinished) {
      lenis.stop();
    } else {
      lenis.start();
    }

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isPreloadComplete, isSequenceFinished]);

  // Scroll to top immediately when a detail sub-page is opened
  useEffect(() => {
    if (selectedRider || selectedTrack) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
      window.scrollTo(0, 0);
    }
  }, [selectedRider, selectedTrack]);

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
    <div id="top" className="relative w-full min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">

      {/* 1. Cinematic Loading Overlay */}
      <AnimatePresence mode="wait">
        {!isPreloadComplete && (
          <Loader progress={preloadProgress} />
        )}
      </AnimatePresence>

      {/* 2. Sticky premium navbar */}
      <Navbar />

      {/* 3. Immersive Main Page Sections */}
      <main className="relative w-full z-10">

        {/* HOMEPAGE VIEWPORT */}
        <div className={selectedRider || selectedTrack || currentView === "calendar" ? "hidden" : "w-full"}>
          {/* HERO CANVAS SEQUENCE (strictly occupies h-screen when playing, unlocks naturally) */}
          <HeroSequence
            isSequenceFinished={isSequenceFinished}
            onProgress={handlePreloadProgress}
            onComplete={handleSequenceComplete}
          />

          {/* Downstream editorial sections are conditionally mounted ONLY after the 191st frame is reached. */}
          {isSequenceFinished && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
            >
              {/* ABOUT / RACING STORYTELLING */}
              <About onSelectRider={setSelectedRider} />

              {/* TEAMS SECTION */}
              <TeamsSection />

              {/* RENDER CINEMATIC GALLERY */}
              <Moments onSelectTrack={setSelectedTrack} />

              {/* CINEMATIC CALENDAR PREVIEW / TEASER */}
              <CalendarPreview />

              {/* PERFORMANCE telemetry meters */}
              <Performance />

              {/* HISTORICAL RECORDS AND CHAMPIONS TROPHY */}
              <TrophySection />

              {/* FINAL HERO CTA FOOTER */}
              <FinalSection />
            </motion.div>
          )}
        </div>

        {/* SUB-PAGES RENDERING IN NORMAL FLOW */}
        <AnimatePresence mode="wait">
          {selectedRider && (
            <motion.div
              key="rider-detail-subpage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45 }}
              className="w-full"
            >
              <RiderDetail
                rider={selectedRider}
                onClose={() => setSelectedRider(null)}
              />
            </motion.div>
          )}

          {selectedTrack && (
            <motion.div
              key="track-detail-subpage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45 }}
              className="w-full"
            >
              <TrackDetail
                track={selectedTrack}
                onClose={() => setSelectedTrack(null)}
              />
            </motion.div>
          )}

          {currentView === "calendar" && !selectedRider && !selectedTrack && (
            <motion.div
              key="calendar-detail-subpage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45 }}
              className="w-full"
            >
              <CalendarPage />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

    </div>
  );
}

