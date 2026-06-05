import { useEffect, useRef, useState } from 'react';

// ==========================================
// TRACKS PAGE GRAPHICS (Aero & Flow theme)
// ==========================================

// 1. Aerodynamic Wind Tunnel Canvas Particle Flow
export function AeroWindTunnel() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    // Streamline particles
    const particleCount = 85;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 3 + 4,
        length: Math.random() * 60 + 40,
        thickness: Math.random() * 1 + 0.5,
        color: Math.random() > 0.8 ? 'rgba(229, 0, 20, 0.16)' : 'rgba(255, 255, 255, 0.08)'
      });
    }

    const cx = width / 2;
    const cy = height / 2;
    const obstacleRadius = 210;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Move particle right
        p.x += p.speed;
        if (p.x > width + p.length) {
          p.x = -p.length;
          p.y = Math.random() * height;
        }

        // Aerodynamic deflection around center obstacle
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let drawY = p.y;
        if (dist < obstacleRadius) {
          const force = (obstacleRadius - dist) / obstacleRadius;
          const deflection = (p.y < cy ? -120 : 120) * force;
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

// 2. Hex/ECU Telemetry Scrolling Stream (for Tracks)
export function HexDataStream({ position = 'left' }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const codes = [
      'SYS_OK', 'ECU_ACT', 'ENG_RPM_17.2K', 'THR_100%', 'BRK_11.4B', 
      'GPS_LOCK', 'TEMP_W_98C', 'O2_SEN_0.98', 'SPEED_352', 'LEAN_64D', 
      'GEAR_6', 'TC_LVL_3', 'AERO_BAL_50', 'FLOW_V_340M', 'BAT_14.4V'
    ];

    const generateLog = () => {
      const hex = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
      const code = codes[Math.floor(Math.random() * codes.length)];
      return `0x${hex} // ${code}`;
    };

    const initial = [];
    for (let i = 0; i < 20; i++) {
      initial.push(generateLog());
    }
    setLogs(initial);

    const interval = setInterval(() => {
      setLogs((prev) => {
        const next = [...prev.slice(1)];
        next.push(generateLog());
        return next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`absolute top-28 bottom-28 w-32 hidden xl:flex flex-col gap-1.5 font-mono text-[7px] text-white/15 pointer-events-none select-none z-0 overflow-hidden ${
        position === 'left' ? 'left-6 items-start text-left' : 'right-6 items-end text-right'
      }`}
    >
      {logs.map((log, index) => (
        <span key={index} className="block truncate whitespace-nowrap tracking-wider">
          {log}
        </span>
      ))}
    </div>
  );
}


// ==========================================
// RIDERS PAGE GRAPHICS (Biometrics & ECG theme)
// ==========================================

// 3. HTML5 Canvas Biometric ECG Heartbeat Pulse Grid
export function BiometricECGBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    // ECG Pulse wave coordinates
    let ecgX = 0;
    const speed = 4;
    const wavePoints = [];
    const maxPoints = Math.ceil(width / speed);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint background grid line (middle y-axis)
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Trigger ECG Heartbeat peaks dynamically at set intervals
      const time = Date.now();
      let yOffset = 0;

      // Pulse every 1.1s (simulating a high heart rate of 165 bpm)
      const pulseCycle = time % 1100; 

      if (pulseCycle > 150 && pulseCycle < 350) {
        const cycleProgress = (pulseCycle - 150) / 200; // 0 to 1
        if (cycleProgress < 0.2) {
          // P Wave (small bump)
          yOffset = -Math.sin(cycleProgress * Math.PI * 5) * 12;
        } else if (cycleProgress >= 0.2 && cycleProgress < 0.3) {
          // Q Wave (dipping slightly)
          yOffset = Math.sin((cycleProgress - 0.2) * Math.PI * 10) * 15;
        } else if (cycleProgress >= 0.3 && cycleProgress < 0.5) {
          // R Wave (massive high crest)
          yOffset = -Math.sin((cycleProgress - 0.3) * Math.PI * 5) * 115;
        } else if (cycleProgress >= 0.5 && cycleProgress < 0.7) {
          // S Wave (deep trough)
          yOffset = Math.sin((cycleProgress - 0.5) * Math.PI * 5) * 45;
        } else {
          // T Wave (medium smooth recovery crest)
          yOffset = -Math.sin((cycleProgress - 0.7) * Math.PI * 3.33) * 20;
        }
      }

      // Add new point at current scanline position
      const centerY = height / 2;
      wavePoints.push(centerY + yOffset);
      if (wavePoints.length > maxPoints) {
        wavePoints.shift();
      }

      // Draw active glowing green/red biometric line
      ctx.beginPath();
      for (let i = 0; i < wavePoints.length; i++) {
        const x = i * speed;
        const y = wavePoints[i];
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Red styling for high heart rate theme
      ctx.strokeStyle = 'rgba(229, 0, 20, 0.12)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw scanning lead dot
      if (wavePoints.length > 0) {
        const endX = (wavePoints.length - 1) * speed;
        const endY = wavePoints[wavePoints.length - 1];
        ctx.beginPath();
        ctx.arc(endX, endY, 4, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(229, 0, 20, 0.5)';
        ctx.shadowColor = '#e50014';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

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

// 4. Biometric Vitals Ticker Column (for Riders)
export function VitalsMonitor({ position = 'left' }) {
  const [pulse, setPulse] = useState(165);
  const [temp, setTemp] = useState(38.1);
  const [oxygen, setOxygen] = useState(98);
  const [gForce, setGForce] = useState(1.4);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuating values realistically
      setPulse(Math.floor(Math.random() * 10) + 162);
      setTemp((prev) => parseFloat((38.0 + Math.random() * 0.4).toFixed(1)));
      setOxygen(Math.random() > 0.8 ? 97 : 98);
      setGForce((prev) => parseFloat((1.2 + Math.random() * 0.6).toFixed(1)));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  if (position === 'left') {
    return (
      <div className="absolute top-1/2 -translate-y-1/2 left-6 hidden xl:flex flex-col gap-8 font-mono text-[9px] pointer-events-none select-none z-0 w-32 items-start text-left">
        <div>
          <span className="text-white/20 block tracking-widest text-[8px] font-bold">ECG PULSE</span>
          <span className="text-red-500 font-bold text-[11px] flex items-center gap-1.5 mt-1">
            <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-ping" />
            {pulse} BPM
          </span>
        </div>
        <div>
          <span className="text-white/20 block tracking-widest text-[8px] font-bold">BODY TEMP</span>
          <span className="text-white/70 font-semibold mt-0.5 block">{temp}°C</span>
        </div>
        <div>
          <span className="text-white/20 block tracking-widest text-[8px] font-bold">SUIT OXYGEN</span>
          <span className="text-white/70 font-semibold mt-0.5 block">{oxygen}% SAT</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-1/2 -translate-y-1/2 right-6 hidden xl:flex flex-col gap-8 font-mono text-[9px] pointer-events-none select-none z-0 w-32 items-end text-right">
      <div>
        <span className="text-white/20 block tracking-widest text-[8px] font-bold">G-FORCE FORCE</span>
        <span className="text-red-500 font-bold mt-0.5 block">{gForce} G-LAT</span>
      </div>
      <div>
        <span className="text-white/20 block tracking-widest text-[8px] font-bold">AIRBAG CHARGE</span>
        <span className="text-white/70 font-semibold mt-0.5 block">READY // 100%</span>
      </div>
      <div>
        <span className="text-white/20 block tracking-widest text-[8px] font-bold">HYDRATION VAL</span>
        <span className="text-white/70 font-semibold mt-0.5 block">82% LEVEL</span>
      </div>
    </div>
  );
}


// ==========================================
// SHARED UTILITY GRAPHICS
// ==========================================

// 5. Fluctuating Telemetry Waveform Graph (Shared)
export function TelemetryWaveform({ label, color = '#e50014' }) {
  const [points, setPoints] = useState([]);
  const width = 140;
  const height = 40;

  useEffect(() => {
    const initial = Array(20).fill(20);
    setPoints(initial);

    const interval = setInterval(() => {
      setPoints((prev) => {
        const next = [...prev.slice(1)];
        const time = Date.now() * 0.005;
        const noise = Math.random() * 12 - 6;
        const newVal = Math.max(5, Math.min(height - 5, 20 + Math.sin(time) * 10 + noise));
        next.push(newVal);
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const pathD = points.reduce((acc, p, i) => {
    const x = (i / (points.length - 1)) * width;
    return acc + `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${p.toFixed(1)}`;
  }, '');

  return (
    <div className="flex flex-col items-center gap-1 font-mono text-[8px] text-white/30 pointer-events-none select-none">
      <span className="font-bold tracking-widest uppercase">{label}</span>
      <div className="w-36 h-10 border border-white/5 bg-white/[0.01] rounded-sm p-1 flex items-center justify-center relative overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          <path 
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ transition: 'd 0.15s linear' }}
          />
        </svg>
      </div>
    </div>
  );
}
