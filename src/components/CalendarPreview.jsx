import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// ==========================================
// 1. REUSED RACES MAP COORDINATES
// ==========================================
const coordinates = [
  { mapX: 740, mapY: 340 }, { mapX: 360, mapY: 450 }, { mapX: 200, mapY: 220 },
  { mapX: 435, mapY: 215 }, { mapX: 460, mapY: 180 }, { mapX: 450, mapY: 200 },
  { mapX: 500, mapY: 190 }, { mapX: 520, mapY: 180 }, { mapX: 510, mapY: 170 },
  { mapX: 480, mapY: 155 }, { mapX: 495, mapY: 165 }, { mapX: 460, mapY: 150 },
  { mapX: 445, mapY: 205 }, { mapX: 505, mapY: 195 }, { mapX: 505, mapY: 175 },
  { mapX: 790, mapY: 230 }, { mapX: 740, mapY: 390 }, { mapX: 820, mapY: 460 },
  { mapX: 720, mapY: 365 }, { mapX: 600, mapY: 270 }, { mapX: 435, mapY: 215 },
  { mapX: 448, mapY: 212 }
];

// Simplified world outline
function MiniVectorContinents() {
  return (
    <g className="stroke-white/5 fill-white/[0.008] stroke-[0.8] pointer-events-none select-none">
      <path d="M 80,120 L 150,110 L 210,130 L 240,110 L 260,150 L 280,240 L 220,270 L 150,300 L 115,220 Z" />
      <path d="M 150,300 L 210,330 L 270,330 L 320,400 L 370,440 L 330,530 L 260,420 Z" />
      <path d="M 400,120 L 580,90 L 720,100 L 880,110 L 920,150 L 800,290 L 580,240 L 400,210 Z" />
      <path d="M 440,290 L 520,290 L 570,410 L 510,470 L 430,340 Z" />
      <path d="M 760,440 L 830,440 L 850,490 L 770,510 Z" />
    </g>
  );
}

// Stats counter
function TeaserCounter({ target }) {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress * (2 - progress);
      setCount(Math.floor(ease * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, target]);

  return <span ref={ref}>{count}</span>;
}

// Fading circuit wireframe blueprints
function CircuitBlueprints() {
  const paths = [
    "M 10,40 C 30,10 70,10 90,30 C 110,50 80,80 60,60 C 40,40 20,50 10,40 Z", // Qatar-like
    "M 15,20 L 130,20 C 150,20 150,40 130,50 C 110,60 100,40 80,55 C 60,70 40,85 20,75 Z", // Mugello-like
    "M 20,50 C 35,15 75,10 105,25 C 125,35 130,20 150,30 C 170,40 170,70 150,80 Z" // Assen-like
  ];

  return (
    <div className="absolute inset-0 z-0 pointer-events-none select-none">
      {paths.map((p, idx) => {
        const top = idx === 0 ? "20%" : idx === 1 ? "60%" : "30%";
        const left = idx === 0 ? "12%" : idx === 1 ? "78%" : "85%";
        const rotate = idx * 45;

        return (
          <motion.div
            key={idx}
            style={{
              position: "absolute",
              top,
              left,
              transform: `rotate(${rotate}deg)`,
              width: "120px",
              height: "80px"
            }}
            animate={{
              opacity: [0.015, 0.08, 0.015]
            }}
            transition={{
              duration: 8 + idx * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: idx * 2.5
            }}
          >
            <svg viewBox="0 0 200 120" className="w-full h-full stroke-red-500/25 fill-none stroke-[1]">
              <path d={p} />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}

// ==========================================
// 2. MAIN CALENDAR PREVIEW COMPONENT
// ==========================================
export default function CalendarPreview() {
  const previewRef = useRef(null);

  // Mouse variables for magnetic button & parallax map
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 60, damping: 25 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Button Magnetic springs
  const btnX = useSpring(useMotionValue(0), { stiffness: 90, damping: 15 });
  const btnY = useSpring(useMotionValue(0), { stiffness: 90, damping: 15 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!previewRef.current) return;
      const rect = previewRef.current.getBoundingClientRect();
      // Calculate normalized X/Y coordinates
      const x = ((e.clientX - rect.left) / rect.width) - 0.5;
      const y = ((e.clientY - rect.top) / rect.height) - 0.5;
      
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Transform coordinates for map shifts
  const mapParallaxX = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);
  const mapParallaxY = useTransform(smoothY, [-0.5, 0.5], [-18, 18]);

  // Handle magnetic pull on button hover
  const handleButtonMouseMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    
    // Shift springs slightly (max 18px pull)
    btnX.set(x * 0.35);
    btnY.set(y * 0.35);
  };

  const handleButtonMouseLeave = () => {
    btnX.set(0);
    btnY.set(0);
  };

  // Trigger Client-Side SPA route redirect
  const handleRedirect = (e) => {
    e.preventDefault();
    window.history.pushState({}, '', '/calendar');
    window.dispatchEvent(new Event('popstate'));
  };

  const fullPathD = "M " + coordinates.map(c => `${c.mapX},${c.mapY}`).join(" L ");

  return (
    <section 
      id="calendar" 
      ref={previewRef}
      className="w-full h-screen min-h-[620px] flex flex-col justify-between items-center p-8 text-center select-none bg-[#050508] border-b border-white/5 scroll-mt-20 relative overflow-hidden"
    >
      {/* Carbon fiber grid matrix overlay */}
      <div className="absolute inset-0 tech-grid-dots opacity-[0.035] pointer-events-none z-0" />
      
      {/* Accent spotlight glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65vw] h-[65vw] max-w-[800px] max-h-[800px] bg-red-650/5 filter blur-[60px] pointer-events-none z-0" />

      {/* Fading Blueprints and Floating Particles */}
      <CircuitBlueprints />

      {/* Top Ticker line */}
      <div className="w-full max-w-[1300px] flex justify-between items-center border-b border-white/5 pb-4 font-mono text-[8.5px] text-white/35 mt-16 z-10 select-none">
        <span>PREVIEW STATION // ROAD TO GLORY 2026</span>
        <span>STATUS: ACTIVE SCANNING</span>
      </div>

      {/* Centerpiece Vector World Map with continuous racing route */}
      <motion.div 
        style={{ x: mapParallaxX, y: mapParallaxY }}
        animate={{
          scale: [1, 1.025, 1]
        }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: "easeInOut"
        }}
        className="absolute w-full max-w-[1000px] aspect-[10/6] flex items-center justify-center pointer-events-none select-none z-0 opacity-15"
      >
        <svg viewBox="0 0 1000 600" className="w-full h-full overflow-visible">
          <MiniVectorContinents />
          
          {/* Main route path line */}
          <path 
            d={fullPathD} 
            fill="none" 
            stroke="rgba(255,255,255,0.08)" 
            strokeWidth="2"
            strokeDasharray="5 5"
          />

          {/* Continuous racing telemetry sweep laser light */}
          <path 
            d={fullPathD} 
            fill="none" 
            stroke="#e50014" 
            strokeWidth="3.5"
            strokeLinecap="round"
            className="racing-line-pulse"
            style={{
              filter: "drop-shadow(0 0 8px #e50014)"
            }}
          />

          {/* Glowing checkpoints */}
          {coordinates.map((c, idx) => (
            <circle 
              key={idx}
              cx={c.mapX}
              cy={c.mapY}
              r="4.5"
              fill="#e50014"
              className="pulse-glow-dot opacity-80"
              style={{ animationDelay: `${idx * 0.15}s` }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Main Typography Header Panel */}
      <div className="my-auto flex flex-col items-center z-10 max-w-[950px] mt-8">
        <motion.span 
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-red-500 font-mono text-xs font-bold tracking-[0.25em] uppercase block mb-6"
        >
          ROAD TO GLORY
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.1 }}
          className="text-[clamp(2.5rem,11vw,6.5rem)] sm:text-8xl md:text-[10rem] font-display font-black leading-none uppercase tracking-wider text-white"
        >
          WORLD TOUR
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.25 }}
          className="flex flex-row flex-wrap sm:flex-nowrap justify-center gap-6 sm:gap-10 mt-10 font-display font-black text-lg sm:text-xl text-red-500 border-t border-b border-white/5 py-4 px-4 sm:px-14"
        >
          <div className="text-center sm:text-left">
            <span className="text-white font-mono text-[8.5px] uppercase tracking-widest block font-bold mb-0.5 opacity-40">EVENTS</span>
            <TeaserCounter target={22} /> RACES
          </div>
          <div className="hidden sm:block border-l border-white/5" />
          <div className="text-center sm:text-left">
            <span className="text-white font-mono text-[8.5px] uppercase tracking-widest block font-bold mb-0.5 opacity-40">COUNTRIES</span>
            <TeaserCounter target={18} /> NATIONS
          </div>
          <div className="hidden sm:block border-l border-white/5" />
          <div className="text-center sm:text-left">
            <span className="text-white font-mono text-[8.5px] uppercase tracking-widest block font-bold mb-0.5 opacity-40">CHAMPION</span>
            <TeaserCounter target={1} /> DRIVER
          </div>
        </motion.div>

        {/* Magnetic CTA Button */}
        <motion.button
          onClick={handleRedirect}
          onMouseMove={handleButtonMouseMove}
          onMouseLeave={handleButtonMouseLeave}
          style={{ x: btnX, y: btnY }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative overflow-hidden bg-red-650 hover:bg-red-700 text-white font-mono text-[10px] sm:text-xs font-black uppercase tracking-[0.16em] px-10 py-5 sm:px-12 sm:py-5 mt-14 transition-colors duration-300 rounded-sm cursor-pointer flex items-center gap-3 shadow-lg hover:shadow-red-600/15 group"
        >
          {/* Laser-sweep indicator line */}
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]" />
          
          <span>VIEW THE SEASON JOURNEY</span>
          <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
        </motion.button>
      </div>

      {/* Bottom Ticker line */}
      <div className="w-full max-w-[1300px] flex justify-between items-center border-t border-white/5 pt-4 pb-2 font-mono text-[8.5px] text-white/30 z-10 select-none">
        <span>DUCATI CORSE MOTORSPORT DEPT // TEASER EST</span>
        <span>VALENCIA SEASON FINALE // 2026</span>
      </div>
    </section>
  );
}
