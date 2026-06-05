import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  const navItems = [
    { name: "HOME", href: "#top" },
    { name: "RIDERS", href: "#about" },
    { name: "TRACKS", href: "#moments" },
    { name: "CALENDAR", href: "#calendar" },
    { name: "STANDINGS", href: "#trophy" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Clear any existing scroll timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // If at top of page, keep navbar visible
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else {
        // If scrolling down, hide navbar
        if (currentScrollY > lastScrollY.current) {
          setIsVisible(false);
        } else {
          // If scrolling up, show navbar
          setIsVisible(true);
        }
      }

      // Set timeout to show navbar when scroll stops
      scrollTimeout.current = setTimeout(() => {
        setIsVisible(true);
      }, 250); // 250ms of no scroll activity = user stopped scrolling

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return (
    <header className={`sticky top-0 left-0 w-full z-50 pointer-events-auto flex flex-col transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      {/* Main Glassmorphic Navbar */}
      <div className="w-full bg-[#050505]/85 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto w-full grid grid-cols-3 items-center md:flex md:justify-between px-6 sm:px-8 py-5 md:py-8">
          {/* Hamburger Menu Toggle - Mobile Only (Left Column) */}
          <div className="flex md:hidden justify-start pl-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white/70 hover:text-white p-2 cursor-pointer transition-colors flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X size={24} />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-6 h-6">
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </svg>
              )}
            </button>
          </div>

          {/* Logo Brand (Centered on mobile, Left-aligned on desktop) */}
          <div className="flex justify-center md:justify-start">
            <a href="#top" onClick={() => setIsOpen(false)} className="flex items-center min-w-0 group">
              <img 
                src="/mgp-logo-on-dark.svg" 
                alt="MotoGP Logo" 
                className="h-5 md:h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
            </a>
          </div>

          {/* Navigation Links - Desktop Only */}
          <nav className="hidden md:flex items-center justify-center gap-3 sm:gap-6 md:gap-8">
            {navItems.map((item, i) => {
              const isCalendar = item.name === "CALENDAR";
              const isHome = item.name === "HOME";

              const handleClick = (e) => {
                const currentPath = window.location.pathname;

                if (isCalendar) {
                  e.preventDefault();
                  window.history.pushState({}, '', '/calendar');
                  window.dispatchEvent(new Event('popstate'));
                } else if (isHome) {
                  e.preventDefault();
                  window.history.pushState({}, '', '/');
                  window.dispatchEvent(new Event('popstate'));
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                } else if (item.href.startsWith('#')) {
                  if (currentPath === '/calendar') {
                    e.preventDefault();
                    window.history.pushState({}, '', '/');
                    window.dispatchEvent(new Event('popstate'));
                    setTimeout(() => {
                      const el = document.querySelector(item.href);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 150);
                  }
                }
              };

              return (
                <a
                  key={i}
                  href={item.href}
                  onClick={handleClick}
                  className="relative font-display text-[10px] sm:text-xs font-bold text-white/50 hover:text-white transition-colors duration-200 py-2.5 px-1.5 tracking-[0.15em] uppercase group"
                >
                  {item.name}
                  {isCalendar ? (
                    <span className="absolute bottom-[-4px] left-0 w-full overflow-hidden h-[8px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full stroke-red-600 fill-none stroke-[2]">
                        <path d="M 0 5 Q 25 1 50 9 T 100 5" className="racing-line-pulse" style={{ strokeDasharray: "15 85" }} />
                      </svg>
                    </span>
                  ) : (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Button - Desktop Only */}
          <a
            href="#moments"
            className="hidden md:flex relative overflow-hidden border border-white/10 hover:border-red-600 text-white font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] px-8 py-4 sm:px-10 transition-colors duration-300 items-center gap-2 group bg-white/5"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full pulse-glow-dot" />
              LIVE TIMING
            </span>
            <div className="absolute inset-0 bg-red-600 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 z-0" />
          </a>

          {/* Mobile Right-Side Spacer (Right Column) */}
          <div className="block md:hidden" />
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 w-full h-screen bg-white z-[9999] flex flex-col md:hidden overflow-y-auto select-none"
          >
            {/* Drawer Header */}
            <div className="w-full bg-white border-b border-neutral-100 px-6 py-6">
              <div className="max-w-[1440px] mx-auto w-full grid grid-cols-3 items-center">
                {/* Close Button (Left Column) */}
                <div className="flex justify-start pl-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-neutral-800 hover:text-black p-2 cursor-pointer transition-colors flex items-center justify-center"
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Logo Brand (Centered) */}
                <div className="flex justify-center">
                  <a href="#top" onClick={() => setIsOpen(false)} className="flex items-center min-w-0">
                    <img 
                      src="/image.png" 
                      alt="MotoGP Logo" 
                      className="h-14 w-auto object-contain" 
                    />
                  </a>
                </div>

                {/* Login Button (Right Column) */}
                <div className="flex justify-end pr-2">
                  <a 
                    href="#login" 
                    onClick={() => setIsOpen(false)} 
                    className="font-display text-[10px] sm:text-xs font-bold text-neutral-800 hover:text-black tracking-[0.12em] uppercase"
                  >
                    LOGIN
                  </a>
                </div>
              </div>
            </div>

            {/* Drawer Body Content */}
            <div className="flex-1 px-8 py-6 flex flex-col gap-8 overflow-y-auto bg-white">
              {/* "Become a Fan" pill button */}
              <a 
                href="#register" 
                onClick={() => setIsOpen(false)}
                className="w-full flex justify-between items-center bg-[#f3f4f6] hover:bg-[#e5e7eb] px-5 py-4 rounded-full transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  {/* Helmet Icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-700">
                    <path d="M2 12a10 10 0 1 1 20 0c0 4.4-3.6 8-8 8v-2a6 6 0 0 0-4-5.65" />
                    <path d="M12 18v2" />
                    <path d="M8 12a4 4 0 0 1 8 0" />
                  </svg>
                  <span className="font-display text-[11px] sm:text-xs font-extrabold text-neutral-800 tracking-[0.1em] uppercase">
                    BECOME A FAN
                  </span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>

              {/* Navigation list */}
              <nav className="flex flex-col gap-5 text-left pl-2">
                {navItems.map((item, i) => {
                  const isCalendar = item.name === "CALENDAR";
                  const isHome = item.name === "HOME";

                  const handleClick = (e) => {
                    const currentPath = window.location.pathname;
                    setIsOpen(false);

                    if (isCalendar) {
                      e.preventDefault();
                      window.history.pushState({}, '', '/calendar');
                      window.dispatchEvent(new Event('popstate'));
                    } else if (isHome) {
                      e.preventDefault();
                      window.history.pushState({}, '', '/');
                      window.dispatchEvent(new Event('popstate'));
                      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    } else if (item.href.startsWith('#')) {
                      if (currentPath === '/calendar') {
                        e.preventDefault();
                        window.history.pushState({}, '', '/');
                        window.dispatchEvent(new Event('popstate'));
                        setTimeout(() => {
                          const el = document.querySelector(item.href);
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 150);
                      }
                    }
                  };

                  const displayName = item.name.charAt(0) + item.name.slice(1).toLowerCase();

                  return (
                    <motion.a
                      key={i}
                      href={item.href}
                      onClick={handleClick}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      className="font-display text-sm font-bold text-neutral-800 hover:text-black py-2.5 border-b border-neutral-100 tracking-[0.1em] uppercase transition-colors"
                    >
                      {displayName}
                    </motion.a>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


