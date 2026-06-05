import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

function SpecGauge({ spec, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [count, setCount] = useState(0);

  const targetVal = parseFloat(spec.value);
  
  useEffect(() => {
    if (!inView) return;
    
    let start = 0;
    const duration = 1.8;
    const totalSteps = 60;
    const stepTime = (duration * 1000) / totalSteps;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const current = start + (targetVal - start) * (step / totalSteps);
      
      if (targetVal % 1 !== 0) {
        setCount(current.toFixed(1));
      } else {
        setCount(Math.floor(current));
      }
      
      if (step >= totalSteps) {
        clearInterval(timer);
        setCount(spec.value);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [inView, targetVal, spec.value]);

  const radius = 60;
  const circumference = Math.PI * radius; // 188.5
  const maxVal = spec.suffix.includes("HP") ? 300 : spec.suffix.includes("KM/H") ? 400 : 200;
  const pct = inView ? Math.min(100, (parseFloat(count) / maxVal) * 100) : 0;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col items-center text-center p-5 sm:p-8 md:p-10 relative bg-white border border-gray-100 hover:border-red-600/30 rounded-sm transition-all duration-500 hover:shadow-2xl hover:shadow-black/5"
    >
      {/* Red Accent line top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-red-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out z-30" />

      <div className="mb-4">
        <h3 className="text-xl md:text-2xl font-display font-black leading-tight text-black mb-1 group-hover:text-red-600 transition-colors duration-300">
          {spec.title}
        </h3>
        <span className="font-mono text-[9px] text-gray-400 font-bold tracking-[0.16em] uppercase block">{spec.label}</span>
      </div>
      
      {/* Tachometer RPM Semi-Circle Gauge */}
      <div className="relative w-44 h-28 flex flex-col items-center justify-end mb-2">
        <svg className="w-full h-full" viewBox="0 0 150 90">
          {/* Background track path */}
          <path 
            d="M 15 75 A 60 60 0 0 1 135 75" 
            fill="none" 
            stroke="rgba(0,0,0,0.05)" 
            strokeWidth="6" 
            strokeLinecap="round"
          />
          {/* Active gauge path */}
          <motion.path 
            d="M 15 75 A 60 60 0 0 1 135 75" 
            fill="none" 
            stroke="#e50014" 
            strokeWidth="6" 
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
          />
        </svg>

        {/* Real-time Counter readout in the center of the arc */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="text-3xl font-display font-black text-black group-hover:scale-105 transition-transform duration-300">
            {count}
          </span>
          <span className="text-[9px] font-mono text-gray-500 font-bold uppercase tracking-widest mt-0.5">
            {spec.suffix.trim()}
          </span>
        </div>
      </div>

      {/* Small tech description footer */}
      <div className="text-[8px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase tracking-widest mt-2">
        telemetry feed // rx-0{index + 1}
      </div>
    </motion.div>
  );
}

export default function Performance() {
  const specs = [
    {
      title: "DUCATI GP24",
      value: "250",
      suffix: " HP+",
      label: "1000cc V4 ENGINE"
    },
    {
      title: "KTM RC16",
      value: "360",
      suffix: " KM/H+",
      label: "STEEL TRELLIS FRAME"
    },
    {
      title: "APRILIA RS-GP",
      value: "157",
      suffix: " KG",
      label: "V4 PROTOTYPE"
    }
  ];

  return (
    <section 
      id="performance"
      className="section-shell bg-white border-b border-gray-200 z-10 scroll-mt-28"
    >
      <div className="section-container">
        
        {/* Section Title */}
        <div className="section-header">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-eyebrow">
              Factory Engineering
            </span>
            <h2 className="section-title text-black">
              PROTOTYPE<br />
              <span className="font-black">MACHINERY.</span>
            </h2>
          </motion.div>
        </div>

        {/* Specs Grid */}
        <div className="section-grid">
          {specs.map((spec, i) => (
            <SpecGauge 
              key={i} 
              spec={spec} 
              index={i} 
            />
          ))}
        </div>

      </div>
    </section>
  );
}

