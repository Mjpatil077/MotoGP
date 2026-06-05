import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// ==========================================
// 1. SMART COUNT-UP ELEMENT
// ==========================================
function CountUp({ value, duration = 1200, delay = 100 }) {
  const [count, setCount] = useState(0);
  
  // Extract number from string
  const numberMatch = String(value).replace(/,/g, '').match(/\d+(\.\d+)?/);
  const target = numberMatch ? parseFloat(numberMatch[0]) : null;
  const suffix = numberMatch ? String(value).replace(numberMatch[0], '') : value;
  const isDecimal = numberMatch && numberMatch[0].includes('.');

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
      
      const ease = progress * (2 - progress);
      const currentVal = ease * target;
      
      setCount(isDecimal ? parseFloat(currentVal.toFixed(3)) : Math.floor(currentVal));
      
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
  }, [target, duration, delay, value, isDecimal]);
  
  if (target === null || isNaN(target)) return <span>{value}</span>;
  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

// ==========================================
// 2. TACHOMETER HOVER SPEC (Lap Record)
// ==========================================
function TachometerRPM() {
  return (
    <svg viewBox="0 0 100 100" className="w-16 h-16 select-none pointer-events-none">
      {/* Gauge track */}
      <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" strokeDasharray="180 120" strokeLinecap="round" transform="rotate(130 50 50)" />
      {/* Redline zone */}
      <circle cx="50" cy="50" r="38" fill="none" stroke="#e50014" strokeWidth="5" strokeDasharray="45 255" strokeLinecap="round" transform="rotate(265 50 50)" className="opacity-80" />
      {/* Moving needle */}
      <line x1="50" y1="50" x2="50" y2="16" stroke="#e50014" strokeWidth="2" strokeLinecap="round" className="tach-needle" />
      {/* Center caps */}
      <circle cx="50" cy="50" r="5" fill="#e50014" />
      <circle cx="50" cy="50" r="2" fill="#ffffff" />
      <text x="50" y="70" className="fill-white/30 font-mono text-[6px] tracking-wider" textAnchor="middle">RPM x1000</text>
    </svg>
  );
}

// ==========================================
// 3. G-FORCE INDICATOR (Top Speed)
// ==========================================
function GForceEllipse() {
  const [dotPos, setDotPos] = useState({ x: 50, y: 50 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 18;
      setDotPos({
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius
      });
    }, 280);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-white/10 fill-none stroke-[0.8] select-none pointer-events-none">
      <circle cx="50" cy="50" r="36" strokeDasharray="4 4" />
      <circle cx="50" cy="50" r="18" />
      <line x1="50" y1="10" x2="50" y2="90" />
      <line x1="10" y1="50" x2="90" y2="50" />
      <circle cx={dotPos.x} cy={dotPos.y} r="2.5" fill="#e50014" className="transition-all duration-300" />
      <text x="12" y="18" className="fill-white/30 font-mono text-[5px] stroke-none">LAT/LON G</text>
    </svg>
  );
}

// ==========================================
// 4. CORNER DISTRIBUTION METER (Corners)
// ==========================================
function CornerBalanceChart({ desc }) {
  // Extract right and left count from e.g. "10 Right / 6 Left Turns"
  const match = String(desc).match(/(\d+)\s*Right\s*\/\s*(\d+)\s*Left/i);
  const rightVal = match ? parseInt(match[1], 10) : 9;
  const leftVal = match ? parseInt(match[2], 10) : 6;
  const total = rightVal + leftVal;
  const rightPct = (rightVal / total) * 100;
  const leftPct = (leftVal / total) * 100;

  return (
    <div className="flex flex-col gap-1.5 w-28 text-[7px] font-mono text-white/50 select-none pointer-events-none pr-1">
      <div className="flex justify-between font-bold text-[6.5px] text-white/35">
        <span>{leftVal} L-TURNS</span>
        <span>{rightVal} R-TURNS</span>
      </div>
      <div className="w-full h-2 bg-white/5 rounded-sm overflow-hidden flex border border-white/10">
        <div className="h-full bg-blue-500/70" style={{ width: `${leftPct}%` }} />
        <div className="h-full bg-red-600/75" style={{ width: `${rightPct}%` }} />
      </div>
      <span className="text-[5.5px] text-center text-white/30 uppercase leading-none">BIAS: {rightPct > leftPct ? 'RIGHT HEAVY' : 'LEFT HEAVY'}</span>
    </div>
  );
}

// ==========================================
// 5. ACCELERATOR THROTTLE LOAD (Velocity Zone)
// ==========================================
function VelocityZoneChart({ value }) {
  return (
    <div className="flex flex-col gap-1 w-28 text-[7px] font-mono text-white/50 select-none pointer-events-none pr-1">
      <div className="flex justify-between text-white/35 font-bold">
        <span>STRAIGHT</span>
        <span>{value}</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative border border-white/10">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-red-600 to-red-600/5 w-1/2"
        />
      </div>
      <span className="text-[5.5px] text-white/35 text-right uppercase">LOAD RATE // 100% THR</span>
    </div>
  );
}

// ==========================================
// 6. LIVE SIMULATED SPEED/GEAR TELEMETRY
// ==========================================
function LiveTelemetryWidget() {
  const [stats, setStats] = useState({ speed: 280, gear: 5, throttle: 100, brake: 0 });

  useEffect(() => {
    let speedVal = 260;
    let gearVal = 5;
    let throttleVal = 100;
    let brakeVal = 0;
    let cycle = 0;

    const interval = setInterval(() => {
      cycle = (cycle + 1) % 100;
      
      if (cycle < 45) {
        // Full throttle drag
        speedVal += Math.ceil((354 - speedVal) * 0.14);
        gearVal = speedVal > 315 ? 6 : 5;
        throttleVal = 100;
        brakeVal = 0;
      } else if (cycle >= 45 && cycle < 72) {
        // Slowing down for apex
        speedVal -= Math.ceil((speedVal - 82) * 0.22);
        gearVal = speedVal < 115 ? 2 : speedVal < 175 ? 3 : 4;
        throttleVal = Math.max(0, 10 - (cycle - 45) * 3);
        brakeVal = Math.min(100, (cycle - 45) * 11);
      } else {
        // Acceleration phase
        speedVal += Math.ceil((260 - speedVal) * 0.18);
        gearVal = speedVal > 180 ? 4 : 3;
        throttleVal = Math.min(100, (cycle - 72) * 9);
        brakeVal = Math.max(0, brakeVal - 18);
      }

      setStats({
        speed: Math.max(78, Math.min(speedVal, 362)) + (cycle % 3),
        gear: gearVal,
        throttle: Math.max(0, Math.min(throttleVal, 100)),
        brake: Math.max(0, Math.min(brakeVal, 100))
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#050b14]/85 border border-white/10 p-4 rounded-md font-mono text-[9px] text-white/80 w-44 z-20 flex flex-col gap-2 relative shadow-2xl backdrop-blur-md">
      <div className="flex justify-between items-center border-b border-white/10 pb-1.5 font-bold tracking-widest text-[8px] text-red-500">
        <span>CIRCUIT TELEM</span>
        <span className="timing-flash">● LIVE</span>
      </div>
      
      <div className="flex justify-between items-end">
        <span className="text-white/40 tracking-wider">SPEED:</span>
        <div>
          <span className="text-lg font-black text-white">{stats.speed}</span>
          <span className="text-[7.5px] text-red-500 font-bold ml-0.5">KM/H</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-white/40 tracking-wider">GEAR SELECT:</span>
        <span className="text-[10px] font-black text-red-500 bg-red-950/40 px-2 py-0.5 border border-red-900/30 rounded-sm">
          G-{stats.gear}
        </span>
      </div>
      
      <div className="flex flex-col gap-0.5 mt-1">
        <div className="flex justify-between text-[7.5px] text-white/45 font-bold">
          <span>THR: {stats.throttle}%</span>
          <span>BRK: {stats.brake}%</span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full flex gap-[1px]">
          <div className="h-full bg-green-500 transition-all duration-75" style={{ width: `${stats.throttle}%` }} />
          <div className="h-full bg-red-600 transition-all duration-75" style={{ width: `${stats.brake}%` }} />
        </div>
      </div>

      <div className="absolute -top-1 -left-1 text-[7px] text-white/30 font-bold select-none">+</div>
      <div className="absolute -bottom-1 -right-1 text-[7px] text-white/30 font-bold select-none">+</div>
    </div>
  );
}

// ==========================================
// 7. AERO WIND TUNNEL BACKDROP (Customized)
// ==========================================
function AeroWindTunnelBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    const particles = [];
    const particleCount = 70;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 4 + 4,
        length: Math.random() * 70 + 40,
        thickness: Math.random() * 0.8 + 0.4,
        color: Math.random() > 0.8 ? 'rgba(229, 0, 20, 0.18)' : 'rgba(255, 255, 255, 0.05)'
      });
    }

    const cx = width / 2;
    const cy = height / 2;
    const obstacleRadius = 240;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speed;
        if (p.x > width + p.length) {
          p.x = -p.length;
          p.y = Math.random() * height;
        }

        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let drawY = p.y;
        if (dist < obstacleRadius) {
          const force = (obstacleRadius - dist) / obstacleRadius;
          const deflection = (p.y < cy ? -140 : 140) * force;
          drawY += deflection;
        }

        ctx.beginPath();
        ctx.moveTo(p.x - p.length, drawY);
        ctx.lineTo(p.x, drawY);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.thickness;
        ctx.stroke();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

// ==========================================
// 8. CARD SUB-COMPONENTS
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
        <span className="text-2xl md:text-[1.85rem] font-display font-black text-white block leading-none">
          <CountUp value={item.value} />
        </span>
      </div>

      <div className="px-5 pb-4 flex items-center justify-between border-t border-white/[0.04] pt-2.5">
        {isHovered ? (
          <div className="w-16 h-12 flex items-center justify-center animate-fade-in">
            {item.title === "LAP RECORD" && <TachometerRPM />}
            {item.title === "TOP SPEED" && <GForceEllipse />}
          </div>
        ) : null}
        <span className="text-[9.5px] text-white/45 font-mono tracking-wide text-left ml-0 flex-1">
          {item.desc}
        </span>
      </div>

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
          <div className="w-24 h-12 flex items-center justify-center">
            {item.title === "CORNER DETAIL" && <CornerBalanceChart desc={item.desc} />}
            {item.title === "VELOCITY ZONE" && <VelocityZoneChart value={item.value} />}
          </div>
        )}
        <span className="text-[9.5px] text-white/45 font-mono tracking-wide text-right ml-auto flex-1">
          {item.desc}
        </span>
      </div>

      <div className="absolute top-2 left-2.5 text-[9px] text-white/15 font-mono font-bold leading-none select-none pointer-events-none">
        +
      </div>
    </motion.div>
  );
}

// ==========================================
// 9. MAIN TRACK DETAIL REDESIGN PAGE
// ==========================================
export default function TrackDetail({ track, onClose }) {
  if (!track) return null;

  // Mouse coordinates logic for blueprint parallax depth
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

  // Transforms — kept subtle for motion safety, max ±12px map, ±6px cards
  const bgX = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const bgY = useTransform(smoothY, [-0.5, 0.5], [-10, 10]);

  const mapX = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const mapY = useTransform(smoothY, [-0.5, 0.5], [-12, 12]);

  const cardsX = useTransform(smoothX, [-0.5, 0.5], [6, -6]);
  const cardsY = useTransform(smoothY, [-0.5, 0.5], [5, -5]);

  // Environmental info for the header
  const envData = {
    "01": { code: "QAT", name: "QATAR", temp: "46.5°C", hum: "52%", air: "1012 hPa" },
    "02": { code: "MUG", name: "MUGELLO", temp: "38.2°C", hum: "44%", air: "1009 hPa" },
    "03": { code: "ASS", name: "ASSEN", temp: "28.4°C", hum: "68%", air: "1005 hPa" }
  };
  const env = envData[track.id] || { code: "TELEM", name: "UNKNOWN", temp: "35.0°C", hum: "50%", air: "1010 hPa" };

  const trackData = {
    "01": {
      left: [
        { title: "LAP RECORD", value: "1:52.772", desc: "F. Bagnaia (Ducati, 2024)" },
        { title: "POLE POSITION", value: "1:50.754", desc: "Jorge Martin (Ducati, 2024)" },
        { title: "TOP SPEED", value: "362.4 KM/H", desc: "Enea Bastianini (Ducati, 2024)" }
      ],
      right: [
        { title: "CIRCUIT LENGTH", value: "5.380 KM", desc: "Official Track Distance" },
        { title: "CORNER DETAIL", value: "16 CORNERS", desc: "10 Right / 6 Left Turns" },
        { title: "VELOCITY ZONE", value: "1068 METERS", desc: "Main Start/Finish Straight" }
      ]
    },
    "02": {
      left: [
        { title: "LAP RECORD", value: "1:45.344", desc: "F. Bagnaia (Ducati, 2024)" },
        { title: "POLE POSITION", value: "1:44.504", desc: "Jorge Martin (Ducati, 2024)" },
        { title: "TOP SPEED", value: "366.1 KM/H", desc: "Brad Binder (KTM, 2023)" }
      ],
      right: [
        { title: "CIRCUIT LENGTH", value: "5.245 KM", desc: "Official Track Distance" },
        { title: "CORNER DETAIL", value: "15 CORNERS", desc: "9 Right / 6 Left Turns" },
        { title: "VELOCITY ZONE", value: "1141 METERS", desc: "Blind-Crest Main Straight" }
      ]
    },
    "03": {
      left: [
        { title: "LAP RECORD", value: "1:31.866", desc: "F. Bagnaia (Ducati, 2024)" },
        { title: "POLE POSITION", value: "1:31.340", desc: "F. Bagnaia (Ducati, 2024)" },
        { title: "TOP SPEED", value: "319.8 KM/H", desc: "Maverick Viñales (Aprilia, 2024)" }
      ],
      right: [
        { title: "CIRCUIT LENGTH", value: "4.542 KM", desc: "Official Track Distance" },
        { title: "CORNER DETAIL", value: "18 CORNERS", desc: "12 Right / 6 Left Turns" },
        { title: "VELOCITY ZONE", value: "487 METERS", desc: "Geert Timmer Chicane Straight" }
      ]
    }
  };

  const dataset = trackData[track.id] || { left: [], right: [] };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full min-h-screen blueprint-bg flex flex-col justify-between py-6 px-0 font-mono text-white pointer-events-auto overflow-hidden"
    >
      {/* 1. Technical blueprint grid layout */}
      <AeroWindTunnelBackground />

      {/* Grid crosshair elements in the corners */}
      <div className="absolute top-20 left-10 text-white/10 text-[10px] hidden lg:block select-none font-bold">
        + SYS_CAD_GRID_2026 // LOC: {track.coords}
      </div>
      <div className="absolute bottom-20 right-10 text-white/10 text-[10px] hidden lg:block select-none font-bold">
        + DATA_FEED_PORT_88
      </div>

      {/* Giant Location Code Watermark */}
      <motion.div 
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none select-none z-0 overflow-hidden leading-none"
      >
        <div className="text-[34vw] font-display font-black text-white/[0.015] tracking-widest text-stroke select-none">
          {env.code}
        </div>
        <div className="text-[5vw] font-display font-bold text-red-500/[0.03] tracking-[0.3em] -mt-16 select-none">
          {env.name} CIRCUIT
        </div>
      </motion.div>

      {/* 2. Top Header (Back, Title, Environment Timing ticker) */}
      <div className="w-full max-w-[1600px] mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center z-20 px-4 sm:px-10 lg:px-20">
        <button
          onClick={onClose}
          className="flex items-center gap-2.5 text-[10px] sm:text-xs font-bold text-white/45 hover:text-white uppercase tracking-[0.16em] transition-all border border-white/10 hover:border-red-600 px-5 py-2.5 bg-white/[0.02] hover:bg-red-600/5 cursor-pointer rounded-sm"
        >
          <ArrowLeft size={14} className="stroke-[2.5]" />
          <span>BACK TO CIRCUITS</span>
        </button>

        {/* Symmetrical desktop title */}
        <div className="text-center hidden lg:block">
          <span className="text-red-500 text-[10px] font-bold tracking-[0.22em] uppercase block mb-1">RACE CONTROL TELEMETRY</span>
          <h1 className="text-3xl font-display font-black leading-none uppercase tracking-widest text-white">
            {track.title}
          </h1>
        </div>

        {/* Environmental readouts */}
        <div className="flex flex-col text-right font-mono text-[8px] sm:text-[9px] text-white/50 tracking-wider">
          <div className="flex gap-3 justify-end text-red-500 font-bold mb-0.5">
            <span>TEMP: {env.temp}</span>
            <span>HUM: {env.hum}</span>
          </div>
          <span>AIR PRESS: {env.air}</span>
        </div>
      </div>

      {/* 3. Symmetrical Layout Grid — centered mission-control composition */}
      <div className="relative flex-grow w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-center z-10 px-4 sm:px-10 lg:px-20 gap-6 lg:gap-10 py-6 overflow-hidden h-full">
        
        {/* Mobile View Title */}
        <div className="lg:hidden text-center mt-4 mb-4 z-20">
          <span className="text-red-500 text-[9px] font-bold tracking-[0.22em] uppercase block mb-0.5">RACE CONTROL TELEMETRY</span>
          <h1 className="text-3xl sm:text-4xl font-display font-black leading-none uppercase tracking-widest text-white">
            {track.title}
          </h1>
          <span className="text-white/45 font-mono text-[10px] mt-1.5 block tracking-widest">
            {env.name} // TEMP: {env.temp}
          </span>
        </div>

        {/* LEFT COLUMN: Track stats cards — pulled close to circuit */}
        <div className="hidden lg:flex w-full lg:w-[24%] flex-col gap-4 justify-center self-center">
          {dataset.left.map((item, index) => (
            <StatCard key={index} item={item} index={index} cardsX={cardsX} cardsY={cardsY} />
          ))}
        </div>

        {/* CENTER COLUMN: Central Circuit with HUD widget overlay */}
        <motion.div
          style={{ x: mapX, y: mapY }}
          className="relative flex flex-col items-center justify-center w-full lg:w-[44%] h-[40vh] sm:h-[45vh] lg:h-[75vh] z-10 select-none"
        >
          {/* Symmetrical tech circle grid */}
          <div className="absolute w-[360px] h-[360px] border border-white/[0.03] rounded-full flex items-center justify-center pointer-events-none">
            <div className="w-[280px] h-[280px] border border-dashed border-white/[0.03] rounded-full animate-spin" style={{ animationDuration: '60s' }} />
          </div>
          <div className="absolute w-[440px] h-[440px] border border-white/[0.015] rounded-full pointer-events-none" />

          {/* Sized SVG mapping box */}
          <div className="w-full max-w-[450px] aspect-[4/3] flex items-center justify-center relative p-6 drop-shadow-[0_0_20px_rgba(229,0,20,0.4)]">
            <svg viewBox="0 0 200 120" className="w-full h-full">
              {/* Background Path */}
              <path 
                d={track.pathD}
                fill="none" 
                stroke="rgba(255, 255, 255, 0.05)" 
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Self-tracing red circuit */}
              <motion.path 
                d={track.pathD}
                fill="none" 
                stroke="#e50014" 
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />
              {/* Racing Rider Dot */}
              <circle r="3.5" fill="#ffffff" className="shadow-lg">
                <animateMotion 
                  dur="4.5s" 
                  repeatCount="indefinite" 
                  path={track.pathD} 
                />
              </circle>
              {/* Pulse halos */}
              <circle r="7.5" fill="none" stroke="#e50014" strokeWidth="1" className="pulse-glow-dot">
                <animateMotion 
                  dur="4.5s" 
                  repeatCount="indefinite" 
                  path={track.pathD} 
                />
              </circle>
            </svg>

            {/* Live Changing Telemetry Widget overlaid next to the track (desktop only) */}
            <div className="absolute bottom-[-10px] right-[-20px] hidden xl:block z-25">
              <LiveTelemetryWidget />
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Track details specs — pulled close to circuit */}
        <div className="hidden lg:flex w-full lg:w-[24%] flex-col gap-4 justify-center self-center">
          {dataset.right.map((item, index) => (
            <TelemetryCard key={index} item={item} index={index} cardsX={cardsX} cardsY={cardsY} />
          ))}
        </div>

        {/* MOBILE/TABLET SCROLLABLE HUD (Horizontal swipe carousel at bottom) */}
        <div className="flex lg:hidden w-full overflow-x-auto pb-4 gap-4 scrollbar-none snap-x snap-mandatory z-20 mt-4">
          {dataset.left.map((item, index) => (
            <div key={`mob-track-left-${index}`} className="min-w-[260px] snap-center">
              <StatCard item={item} index={index} cardsX={0} cardsY={0} />
            </div>
          ))}
          {dataset.right.map((item, index) => (
            <div key={`mob-track-right-${index}`} className="min-w-[260px] snap-center">
              <TelemetryCard item={item} index={index} cardsX={0} cardsY={0} />
            </div>
          ))}
        </div>

      </div>

      {/* 4. Bottom technical console status footer */}
      <div className="w-full max-w-[1600px] mx-auto flex justify-between items-center border-t border-white/5 pt-4 pb-2 z-20 px-4 sm:px-10 lg:px-20">
        <span className="font-mono text-[9px] text-white/30 tracking-widest uppercase hidden md:inline">
          LIVE SCROLL // PORT 44 TIMING CHANNEL
        </span>
        
        {/* Timing logs indicators */}
        <div className="flex gap-10 mx-auto text-center font-mono text-[9px] text-white/40">
          <div>
            <span className="text-red-500 font-bold block mb-0.5 animate-pulse">● FEED SECURE</span>
            <span>GPS TRACK LOCK</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-white/60 font-bold block mb-0.5">TIMING OFFSET</span>
            <span>+0.000s // REFRESH 60HZ</span>
          </div>
        </div>

        <span className="font-mono text-[9px] text-white/30 tracking-widest uppercase hidden md:inline">
          SYS STATUS NOMINAL // NO ERRORS DETECTED
        </span>
      </div>
    </motion.div>
  );
}
