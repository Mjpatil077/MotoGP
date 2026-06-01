import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

function Counter({ value, duration = 1.5, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (!inView) return;
    
    let start = 0;
    const end = parseFloat(value);
    if (isNaN(end)) {
      setCount(value);
      return;
    }
    
    const totalSteps = 60;
    const stepTime = (duration * 1000) / totalSteps;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const current = start + (end - start) * (step / totalSteps);
      
      if (end % 1 !== 0) {
        setCount(current.toFixed(1));
      } else {
        setCount(Math.floor(current));
      }
      
      if (step >= totalSteps) {
        clearInterval(timer);
        setCount(value);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="font-mono">
      {prefix}{count}{suffix}
    </span>
  );
}

export default function Performance() {
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

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
      ref={ref}
      className="relative w-full bg-white py-48 md:py-64 px-6 md:px-12 flex flex-col items-center justify-center border-t border-gray-200 z-10"
    >
      <div className="relative max-w-[1400px] mx-auto w-full">
        
        {/* Section Title */}
        <div className="mb-32 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-red-600 font-mono text-sm tracking-[0.3em] font-bold uppercase block mb-6">
              Factory Engineering
            </span>
            <h2 className="text-5xl md:text-8xl font-display font-light leading-none tracking-tighter text-black">
              PROTOTYPE<br />
              <span className="font-black">MACHINERY.</span>
            </h2>
          </motion.div>
        </div>

        {/* Specs Grid - No descriptions, just massive numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
          {specs.map((spec, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col border-t-4 border-black pt-12 items-center text-center"
            >
              <div className="mb-10">
                <h3 className="text-3xl font-display font-black tracking-tighter text-black mb-3">
                  {spec.title}
                </h3>
                <span className="font-mono text-[11px] text-gray-500 font-bold tracking-[0.2em] uppercase">{spec.label}</span>
              </div>
              
              <div className="text-6xl md:text-7xl font-display font-light text-black group-hover:text-red-600 transition-colors duration-500">
                <Counter value={spec.value} suffix={spec.suffix} />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
