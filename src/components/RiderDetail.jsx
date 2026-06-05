import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// ==========================================
// 1. SMART COUNT-UP ELEMENT
// ==========================================
function CountUp({ value, duration = 1200, delay = 100 }) {
  const [count, setCount] = useState(0);
  
  // Extract number from string if needed
  const numberMatch = String(value).match(/\d+/);
  const target = numberMatch ? parseInt(numberMatch[0], 10) : null;
  const suffix = numberMatch ? String(value).replace(numberMatch[0], '') : value;

  useEffect(() => {
    if (target === null || isNaN(target)) {
      setCount(value);
      return;
    }
    
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Quadratic ease-out
      const ease = progress * (2 - progress);
      setCount(Math.floor(ease * target));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };
    
    const delayTimer = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, delay);
    
    return () => {
      clearTimeout(delayTimer);
      cancelAnimationFrame(animationFrame);
    };
  }, [target, duration, delay, value]);
  
  if (target === null || isNaN(target)) return <span>{value}</span>;
  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

// ==========================================
// 2. ATMOSPHERIC SMOKE CANVAS
// ==========================================
function SmokeParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const maxParticles = 25;

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * height; // initial random height spread
      }

      reset() {
        this.x = width / 2 + (Math.random() - 0.5) * (width * 0.4);
        this.y = height + Math.random() * 80;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = -(Math.random() * 0.5 + 0.3);
        this.radius = Math.random() * 70 + 60;
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.04 + 0.015;
        this.growth = Math.random() * 0.12 + 0.04;
        // Red carbon glow or charcoal exhaust
        this.color = Math.random() > 0.65 ? '229, 0, 20' : '45, 45, 45';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.radius += this.growth;

        // Fade transitions based on height
        if (this.y > height * 0.7) {
          this.opacity = ((height - this.y) / (height * 0.3)) * this.maxOpacity;
        } else if (this.y < height * 0.3) {
          this.opacity = (this.y / (height * 0.3)) * this.maxOpacity;
        } else {
          this.opacity = this.maxOpacity;
        }

        this.opacity = Math.max(0, Math.min(this.opacity, this.maxOpacity));

        if (this.y < -this.radius || (this.opacity <= 0 && this.y < height * 0.5)) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        const grad = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        grad.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.12)';
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 smoke-canvas" />;
}

// ==========================================
// 3. BACKGROUND RACING CIRCUIT DRIFT
// ==========================================
function BackgroundCircuit() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-[0.035] overflow-hidden">
      <svg 
        viewBox="0 0 1000 600" 
        className="w-[125vw] h-[125vh] stroke-white fill-none stroke-[2.5]"
        style={{ transform: "rotate(-12deg)" }}
      >
        <motion.path 
          d="M 150,150 C 250,50 400,100 500,200 C 600,300 750,150 850,250 C 950,350 900,550 700,500 C 500,450 350,550 200,450 C 50,350 50,250 150,150 Z" 
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4.5, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

// ==========================================
// 4. DYNAMIC RACING LINE ORBIT (Desktop)
// ==========================================
function DynamicRacingLine() {
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible hidden lg:block"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="racingLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e50014" stopOpacity="0.01" />
          <stop offset="30%" stopColor="#e50014" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="70%" stopColor="#e50014" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#e50014" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      
      {/* Background shadow guide */}
      <path
        d="M 120,380 C 450,280 320,820 960,540 C 1600,260 1470,800 1800,700"
        fill="none"
        stroke="rgba(255, 255, 255, 0.025)"
        strokeWidth="3.5"
      />

      {/* Main glowing racing path */}
      <path
        d="M 120,380 C 450,280 320,820 960,540 C 1600,260 1470,800 1800,700"
        fill="none"
        stroke="url(#racingLineGrad)"
        strokeWidth="1.5"
      />

      {/* Moving telemetry pulse dot */}
      <path
        d="M 120,380 C 450,280 320,820 960,540 C 1600,260 1470,800 1800,700"
        fill="none"
        stroke="#e50014"
        strokeWidth="3"
        strokeLinecap="round"
        className="racing-line-pulse"
        style={{
          filter: "drop-shadow(0 0 8px #e50014)",
        }}
      />
    </svg>
  );
}

// ==========================================
// 5. ROTATING CHAMPIONSHIP RINGS
// ==========================================
function RotatingRings({ count }) {
  const ringsToRender = Math.max(1, count); // minimum 1 ring to avoid empty visuals
  
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
      {Array.from({ length: ringsToRender }).map((_, i) => {
        const size = 200 + i * 38; 
        const speed = 12 + i * 4.5;
        const isClockwise = i % 2 === 0;

        return (
          <motion.div
            key={i}
            style={{
              width: size,
              height: size,
            }}
            animate={{
              rotate: isClockwise ? 360 : -360
            }}
            transition={{
              repeat: Infinity,
              duration: speed,
              ease: "linear"
            }}
            className="absolute border border-red-600/10 rounded-full flex items-center justify-center"
          >
            {/* Dashed tech line overlay */}
            <div className="absolute inset-0 rounded-full border border-dashed border-red-500/5" />
            
            {/* Telemetry notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_8px_#e50014] opacity-50" />
            
            {/* Alternate micro dot */}
            <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-white rounded-full opacity-35" />
          </motion.div>
        );
      })}
    </div>
  );
}

// ==========================================
// 6. CHECKERED FLAG HOVER EFFECT (Wins)
// ==========================================
function CheckeredFlag() {
  return (
    <div className="flex gap-[1px] select-none pointer-events-none">
      {Array.from({ length: 6 }).map((_, colIdx) => (
        <div 
          key={colIdx} 
          className={`flex flex-col gap-[1px] ${colIdx % 2 === 0 ? 'flag-wave-0' : 'flag-wave-1'}`}
          style={{ animationDelay: `${colIdx * 0.08}s` }}
        >
          {Array.from({ length: 3 }).map((_, rowIdx) => {
            const isWhite = (colIdx + rowIdx) % 2 === 0;
            return (
              <div 
                key={rowIdx} 
                className={`w-2.5 h-2.5 ${isWhite ? 'bg-white/80' : 'bg-black'} border border-white/5`} 
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 7. MOTORGP RACING BIKE WIREFRAME (Constructor)
// ==========================================
function BikeOutline() {
  return (
    <svg viewBox="0 0 100 60" className="w-24 h-14 stroke-red-500 fill-none stroke-[1.2] select-none pointer-events-none">
      {/* Front Wheel */}
      <circle cx="24" cy="40" r="10" />
      <circle cx="24" cy="40" r="3.5" className="stroke-white/35" />
      {/* Rear Wheel */}
      <circle cx="76" cy="40" r="10" />
      <circle cx="76" cy="40" r="3.5" className="stroke-white/35" />
      {/* Frame & swingarm */}
      <path className="tech-draw-path" d="M 24,40 L 40,22 L 60,22 L 76,40" />
      <path className="tech-draw-path" d="M 40,22 L 48,40 L 76,40" />
      {/* Fairings, tank & tail */}
      <path className="tech-draw-path" d="M 34,22 L 26,15 L 44,12 L 54,22 L 66,22 L 70,14 L 60,14 Z" />
      {/* Front forks & handlebars */}
      <path className="tech-draw-path" d="M 24,40 L 30,16 L 26,12 M 30,16 L 34,16" />
      {/* Technical Labels */}
      <line x1="42" y1="22" x2="48" y2="8" className="stroke-white/15 stroke-[0.5]" />
      <text x="51" y="8" className="fill-white/30 font-mono text-[4.5px] tracking-widest">GP24 WORKFLOW</text>
    </svg>
  );
}

// ==========================================
// 8. TECH COUNTRY OUTLINES (Spain / Italy)
// ==========================================
function CountryOutline({ country }) {
  const isSpain = String(country).toUpperCase() === "SPAIN";

  if (isSpain) {
    return (
      <svg viewBox="0 0 100 80" className="w-20 h-14 stroke-red-500 fill-none stroke-[1.2] select-none pointer-events-none">
        {/* Simplified polygonal map of Spain */}
        <path 
          className="tech-draw-path" 
          d="M 25,18 L 45,15 L 65,18 L 75,24 L 85,22 L 90,35 L 86,52 L 70,68 L 50,72 L 35,66 L 20,64 L 14,48 L 17,30 Z" 
        />
        <circle cx="50" cy="45" r="2.5" className="fill-red-500 animate-ping" />
        <circle cx="50" cy="45" r="1.5" className="fill-red-500" />
        <text x="22" y="58" className="fill-white/35 font-mono text-[5px] tracking-wide">40.46° N, 3.75° W</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-red-500 fill-none stroke-[1.2] select-none pointer-events-none">
      {/* Simplified boot shape polygon of Italy */}
      <path 
        className="tech-draw-path" 
        d="M 20,22 L 45,17 L 55,22 L 52,34 L 65,42 L 55,52 L 62,62 L 78,67 L 85,84 L 78,87 L 60,80 L 52,74 L 40,72 L 32,57 L 28,47 L 20,34 Z" 
      />
      <circle cx="48" cy="45" r="2.5" className="fill-red-500 animate-ping" />
      <circle cx="48" cy="45" r="1.5" className="fill-red-500" />
      <text x="14" y="68" className="fill-white/35 font-mono text-[5px] tracking-wide">41.87° N, 12.56° E</text>
    </svg>
  );
}

// ==========================================
// 9. SUB-COMPONENTS FOR CARDS
// ==========================================
function StatCard({ item, index, cardsX, cardsY }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      style={{ x: cardsX, y: cardsY }}
      initial={{ opacity: 0, x: -28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.15 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="glass-card rounded-md border-l-4 border-l-red-600 relative select-none"
    >
      <div className="px-5 pt-5 pb-3">
        <span className="text-[9px] text-white/35 font-mono tracking-[0.18em] uppercase block mb-2">
          {item.title}
        </span>
        <span className="text-3xl md:text-[2.25rem] font-display font-black text-white block leading-none">
          <CountUp value={item.value} />
        </span>
      </div>

      <div className="px-5 pb-4 flex items-center justify-between border-t border-white/[0.04] pt-2.5">
        <span className="text-[9.5px] text-white/45 font-mono tracking-wide">
          {item.desc}
        </span>
        {isHovered && item.title === "PREMIER WINS" && (
          <div className="pr-1">
            <CheckeredFlag />
          </div>
        )}
      </div>

      {/* Technical coordinate label corner */}
      <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-600 rounded-full" />
    </motion.div>
  );
}

function TelemetryCard({ item, index, cardsX, cardsY }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      style={{ x: cardsX, y: cardsY }}
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.15 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="glass-card rounded-md border-r-4 border-r-red-600 text-right relative select-none"
    >
      <div className="px-5 pt-5 pb-3">
        <span className="text-[9px] text-white/35 font-mono tracking-[0.18em] uppercase block mb-2">
          {item.title}
        </span>
        <span className="text-2xl md:text-[1.85rem] font-display font-black text-white block leading-none">
          {item.value}
        </span>
      </div>

      <div className="px-5 pb-4 flex items-center justify-between border-t border-white/[0.04] pt-2.5 flex-row-reverse">
        {isHovered && (
          <div className="w-20 h-12 flex items-center justify-center">
            {item.title === "CONSTRUCTOR" && <BikeOutline />}
            {item.title === "COUNTRY ORIGIN" && <CountryOutline country={item.value} />}
          </div>
        )}
        <span className="text-[9.5px] text-white/45 font-mono tracking-wide text-right ml-auto">
          {item.desc}
        </span>
      </div>

      {/* Mini crosshair accent corner */}
      <div className="absolute top-2 left-2.5 text-[9px] text-white/15 font-mono font-bold leading-none select-none pointer-events-none">
        +
      </div>
    </motion.div>
  );
}

// ==========================================
// 10. MAIN RIDER DETAIL REDESIGN PAGE
// ==========================================
export default function RiderDetail({ rider, onClose }) {
  if (!rider) return null;

  // Parallax Motion Tracking Hooks
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 60, damping: 25 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mouseX.set((e.clientX / w) - 0.5);
      mouseY.set((e.clientY / h) - 0.5);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Transform coordinates for parallax depth
  // Rider is fixed — only background and cards use subtle parallax
  const bgX = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const bgY = useTransform(smoothY, [-0.5, 0.5], [-10, 10]);

  const cardsX = useTransform(smoothX, [-0.5, 0.5], [6, -6]);
  const cardsY = useTransform(smoothY, [-0.5, 0.5], [5, -5]);

  // Symmetrical career stats & machinery telemetry records
  const riderData = {
    "FRANCESCO BAGNAIA": {
      left: [
        { title: "CHAMPIONSHIPS", value: "2 TITLES", desc: "Premier Class (2022, 2023)" },
        { title: "PREMIER WINS", value: "28 WINS", desc: "Ducati Factory Leader" },
        { title: "CAREER PODIUMS", value: "47 PODIUMS", desc: "World Championship Podiums" }
      ],
      right: [
        { title: "RACING NUMBER", value: "#1", desc: "Official Champion Plate" },
        { title: "CONSTRUCTOR", value: "DUCATI", desc: "GP24 Desmosedici Factory" },
        { title: "TEAM", value: "LENOVO TEAM", desc: "Ducati Corse MotoGP" },
        { title: "COUNTRY ORIGIN", value: "ITALY", desc: "Torino, Italy" }
      ]
    },
    "JORGE MARTIN": {
      left: [
        { title: "CHAMPIONSHIPS", value: "1 TITLE", desc: "Moto3 Class Champion (2018)" },
        { title: "PREMIER WINS", value: "8 WINS", desc: "Prima Pramac Team Leader" },
        { title: "CAREER PODIUMS", value: "28 PODIUMS", desc: "World Championship Podiums" }
      ],
      right: [
        { title: "RACING NUMBER", value: "#89", desc: "Official Championship Plate" },
        { title: "CONSTRUCTOR", value: "DUCATI", desc: "GP24 Pramac Factory Specs" },
        { title: "TEAM", value: "PRAMAC RACING", desc: "Prima Pramac Team" },
        { title: "COUNTRY ORIGIN", value: "SPAIN", desc: "Madrid, Spain" }
      ]
    },
    "MARC MARQUEZ": {
      left: [
        { title: "CHAMPIONSHIPS", value: "8 TITLES", desc: "All Classes (6 Premier Class)" },
        { title: "PREMIER WINS", value: "59 WINS", desc: "Historical Record Holder" },
        { title: "CAREER PODIUMS", value: "102 PODIUMS", desc: "World Championship Podiums" }
      ],
      right: [
        { title: "RACING NUMBER", value: "#93", desc: "Official Championship Plate" },
        { title: "CONSTRUCTOR", value: "DUCATI", desc: "GP23 Gresini Satellite Spec" },
        { title: "TEAM", value: "GRESINI RACING", desc: "Gresini Factory Satellite" },
        { title: "COUNTRY ORIGIN", value: "SPAIN", desc: "Cervera, Spain" }
      ]
    }
  };

  const dataset = riderData[rider.riderName] || { left: [], right: [] };
  
  const chText = dataset.left.find(item => item.title === "CHAMPIONSHIPS")?.value || "0";
  const championshipsCount = parseInt(chText, 10) || 0;

  // Determine short brand watermark values
  const riderNum = rider.riderName === "MARC MARQUEZ" ? "93" : rider.riderName === "FRANCESCO BAGNAIA" ? "01" : "89";
  const championshipSubtext = championshipsCount > 0 ? `${championshipsCount}X WORLD CHAMPION` : "TITLE CHALLENGER";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full min-h-screen carbon-bg flex flex-col justify-between py-6 px-0 font-mono text-white pointer-events-auto overflow-hidden"
    >
      {/* 1. Cinematic Background layers */}
      <BackgroundCircuit />
      <SmokeParticles />
      <DynamicRacingLine />

      {/* Spotlight behind rider (controlled by parallax) */}
      <motion.div 
        style={{ x: bgX, y: bgY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] spotlight-halo rounded-full z-0 pointer-events-none select-none" 
      />

      {/* Atmospheric lighting streaks */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-[-20%] left-[25%] w-[1.5px] h-[140%] bg-gradient-to-b from-transparent via-red-600/10 to-transparent rotate-[38deg]" />
        <div className="absolute top-[-20%] right-[35%] w-[1.5px] h-[140%] bg-gradient-to-b from-transparent via-red-600/10 to-transparent rotate-[38deg]" />
      </div>

      {/* Giant Typography Watermark Background (Parallax linked) */}
      <motion.div 
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none select-none z-0 overflow-hidden leading-none"
      >
        <div className="text-[32vw] font-display font-black text-white/[0.015] tracking-tighter select-none">
          {riderNum}
        </div>
        <div className="text-[4.5vw] font-display font-bold text-red-600/[0.035] tracking-[0.25em] -mt-10 select-none">
          {championshipSubtext}
        </div>
      </motion.div>

      {/* 2. Top Header (Back navigation, Telemetry status) */}
      <div className="w-full max-w-[1600px] mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center z-20 px-4 sm:px-10 lg:px-20">
        <button
          onClick={onClose}
          className="flex items-center gap-2.5 text-[10px] sm:text-xs font-bold text-white/45 hover:text-white uppercase tracking-[0.16em] transition-all border border-white/10 hover:border-red-600 px-5 py-2.5 bg-white/[0.02] hover:bg-red-600/5 cursor-pointer rounded-sm"
        >
          <ArrowLeft size={14} className="stroke-[2.5]" />
          <span>BACK TO DRIVERS</span>
        </button>

        {/* Symmetrical desktop title */}
        <div className="text-center hidden lg:block">
          <span className="text-red-500 text-[10px] font-bold tracking-[0.22em] uppercase block mb-1">ATHLETE BIOMETRICS</span>
          <h1 className="text-3xl font-display font-black leading-none uppercase tracking-widest text-white">
            {rider.riderName}
          </h1>
        </div>

        <div className="flex items-center gap-2 text-[9px] text-red-500 font-bold tracking-widest bg-red-950/20 border border-red-900/30 px-3 py-1.5 rounded-sm">
          <span className="inline-block w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
          ECU TELEMETRY SYSC
        </div>
      </div>

      {/* 3. Core 3-Column Layout — centered composition matching Circuit page */}
      <div className="relative flex-grow w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-center z-10 px-4 sm:px-10 lg:px-20 gap-6 lg:gap-10 py-6 overflow-hidden h-full">
        
        {/* Mobile View Header */}
        <div className="lg:hidden text-center mt-4 mb-4 z-20">
          <span className="text-red-500 text-[9px] font-bold tracking-[0.22em] uppercase block mb-0.5">ATHLETE BIOMETRICS</span>
          <h1 className="text-3xl sm:text-4xl font-display font-black leading-none uppercase tracking-widest text-white">
            {rider.riderName}
          </h1>
          <span className="text-white/40 font-mono text-[10px] mt-1.5 block tracking-widest">
            {championshipSubtext}
          </span>
        </div>

        {/* LEFT COLUMN: Career stat cards */}
        <div className="hidden lg:flex w-full lg:w-[24%] flex-col gap-4 justify-center self-center">
          {dataset.left.map((item, index) => (
            <StatCard key={index} item={item} index={index} cardsX={cardsX} cardsY={cardsY} />
          ))}
        </div>

        {/* CENTER COLUMN: Anchored rider silhouette — no hover motion */}
        <div
          className="relative flex items-center justify-center w-full lg:w-[44%] h-[40vh] sm:h-[45vh] lg:h-[75vh] z-10 select-none"
        >
          {/* Concentric Championship Rings (rendered right behind the rider) */}
          <RotatingRings count={championshipsCount} />

          {/* Symmetrical technical grid cross */}
          <div className="absolute w-[280px] h-[1px] bg-white/[0.04] hidden lg:block" />
          <div className="absolute h-[280px] w-[1px] bg-white/[0.04] hidden lg:block" />

          {/* Fade, Spotlight, & Vertical Wipe reveal */}
          <motion.div
            initial={{ 
              clipPath: "inset(100% 0% 0% 0%)",
              filter: "brightness(0) contrast(1.4)"
            }}
            animate={{ 
              clipPath: "inset(0% 0% 0% 0%)",
              filter: "brightness(1) contrast(1)"
            }}
            transition={{ 
              clipPath: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
              filter: { duration: 1.8, delay: 0.2, ease: "easeOut" }
            }}
            className="h-full flex items-center justify-center relative z-10"
          >
            <img
              src={rider.img}
              alt={rider.riderName}
              className="h-[96%] max-h-[80vh] object-contain object-center drop-shadow-[0_20px_50px_rgba(229,0,20,0.38)] pointer-events-none"
            />
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Machinery telemetry cards */}
        <div className="hidden lg:flex w-full lg:w-[24%] flex-col gap-4 justify-center self-center">
          {dataset.right.map((item, index) => (
            <TelemetryCard key={index} item={item} index={index} cardsX={cardsX} cardsY={cardsY} />
          ))}
        </div>

        {/* MOBILE/TABLET SCROLLABLE HUD (Horizontal swipeable cards at bottom) */}
        <div className="flex lg:hidden w-full overflow-x-auto pb-4 gap-4 scrollbar-none snap-x snap-mandatory z-20 mt-4">
          {dataset.left.map((item, index) => (
            <div key={`mob-left-${index}`} className="min-w-[260px] snap-center">
              <StatCard item={item} index={index} cardsX={0} cardsY={0} />
            </div>
          ))}
          {dataset.right.map((item, index) => (
            <div key={`mob-right-${index}`} className="min-w-[260px] snap-center">
              <TelemetryCard item={item} index={index} cardsX={0} cardsY={0} />
            </div>
          ))}
        </div>

      </div>

      {/* 4. Bottom telemetry state monitor */}
      <div className="w-full max-w-[1600px] mx-auto flex justify-between items-center border-t border-white/5 pt-4 pb-2 z-20 px-4 sm:px-10 lg:px-20">
        <span className="font-mono text-[9px] text-white/30 tracking-widest uppercase hidden md:inline">
          DUCATI CORSE MOTORSPORT DEPT // EST. 1926
        </span>
        
        {/* Symmetrical status info */}
        <div className="flex gap-10 mx-auto text-center font-mono text-[9px] text-white/40">
          <div>
            <span className="text-red-500 font-bold block mb-0.5 animate-pulse">● SIGNAL ACTIVE</span>
            <span>PORT 93.89.01</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-white/60 font-bold block mb-0.5">LATENCY</span>
            <span>0.0024 SEC</span>
          </div>
        </div>

        <span className="font-mono text-[9px] text-white/30 tracking-widest uppercase hidden md:inline">
          MOTO-TELEMETRY // RES ACTIVE
        </span>
      </div>
    </motion.div>
  );
}
