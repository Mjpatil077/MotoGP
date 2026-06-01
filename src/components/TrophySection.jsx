import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function TrophySection() {
  const records = [
    { category: "TOP SPEED RECORD", value: "366.1 KM/H", rider: "Brad Binder", track: "Mugello (2023)" },
    { category: "MOST PREMIER CHAMPIONSHIPS", value: "8 TITLES", rider: "Giacomo Agostini", track: "All-Time Record" },
    { category: "MOST PREMIER CLASS WINS", value: "89 VICTORIES", rider: "Valentino Rossi", track: "The Doctor" },
    { category: "MOST PREMIER POLE POSITIONS", value: "64 POLES", rider: "Marc Marquez", track: "Active Rider" }
  ];

  // 3D Tilt Effect Setup
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for fluid motion
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // Map mouse movement to rotation degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  // Dynamic lighting/glare effect based on mouse position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalized coordinates from -0.5 to 0.5
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    // Reset to center smoothly
    x.set(0);
    y.set(0);
  };

  return (
    <section 
      className="relative w-full bg-[#050505] py-48 md:py-64 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden border-b border-white/5"
    >
      {/* Background glow to anchor the dark section */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/10 rounded-full filter blur-[200px] pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto w-full z-10 flex flex-col lg:flex-row items-center justify-between gap-24">
        
        {/* Left Side: Editorial Records */}
        <div className="w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-red-600 font-mono text-sm tracking-[0.3em] font-bold uppercase block mb-6">
              History & Heritage
            </span>
            <h2 className="text-5xl md:text-8xl font-display font-light leading-none tracking-tighter mb-20 text-white">
              ALL-TIME<br />
              <span className="font-black">RECORDS.</span>
            </h2>
          </motion.div>

          <div className="flex flex-col gap-10">
            {records.map((rec, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 group"
              >
                <div>
                  <span className="font-mono text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase block mb-3">
                    {rec.category}
                  </span>
                  <span className="text-3xl font-display font-bold text-white group-hover:text-red-600 transition-colors duration-300 block mb-1">
                    {rec.rider}
                  </span>
                  <span className="text-sm text-white/50 font-body">{rec.track}</span>
                </div>
                <div className="mt-6 md:mt-0 font-display text-4xl md:text-5xl font-light text-white tracking-tighter">
                  {rec.value}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: High-End 3D Trophy Image Interaction */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative perspective-[1200px]">
          
          <div className="text-center w-full z-20 pointer-events-none mb-8">
            <span className="font-display text-base text-white tracking-[0.3em] uppercase block font-bold">
              THE ULTIMATE PRIZE
            </span>
          </div>

          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative w-full max-w-[500px] aspect-[3/4] cursor-crosshair rounded-sm overflow-hidden border border-white/10 bg-[#111]"
          >
            {/* The Image */}
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=800)',
                transform: "translateZ(50px) scale(1.1)", // Push image out for 3D parallax
              }}
            />

            {/* Dynamic Lighting Glare */}
            <motion.div
              className="absolute inset-0 pointer-events-none mix-blend-overlay z-10"
              style={{
                background: "radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)",
                "--x": glareX,
                "--y": glareY
              }}
            />

            {/* Overlay Gradient to anchor it */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none z-0" />
            
            <div 
              className="absolute bottom-10 left-10 text-white z-20"
              style={{ transform: "translateZ(80px)" }} // Push text even further out
            >
              <span className="font-mono text-[10px] tracking-[0.2em] font-bold uppercase text-red-600 block mb-2">
                Champions Trophy
              </span>
              <span className="font-display font-bold text-2xl tracking-widest uppercase">
                WORLD<br/>CHAMPION
              </span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
