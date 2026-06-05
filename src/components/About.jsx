import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

function RiderCard({ riderName, role, description, img, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [leanAngle, setLeanAngle] = useState(0);

  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  useEffect(() => {
    if (!isHovered) {
      setSpeed(0);
      setLeanAngle(0);
      return;
    }

    let speedVal = 0;
    const targetSpeed = Math.floor(Math.random() * 15) + 340; // 340-355 KM/H
    const speedInterval = setInterval(() => {
      speedVal += Math.ceil((targetSpeed - speedVal) * 0.15);
      if (speedVal >= targetSpeed) {
        speedVal = targetSpeed;
        clearInterval(speedInterval);
      }
      setSpeed(speedVal);
    }, 30);

    let angleVal = 0;
    const targetAngle = Math.floor(Math.random() * 5) + 60; // 60-64 Degrees
    const angleInterval = setInterval(() => {
      angleVal += Math.ceil((targetAngle - angleVal) * 0.2);
      if (angleVal >= targetAngle) {
        angleVal = targetAngle;
        clearInterval(angleInterval);
      }
      setLeanAngle(angleVal);
    }, 40);

    return () => {
      clearInterval(speedInterval);
      clearInterval(angleInterval);
    };
  }, [isHovered]);

  const itemVariants = {
    hidden: { y: 60, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="perspective-[1000px] w-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onSelect}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="group relative overflow-hidden bg-gray-50 premium-card flex flex-col justify-between min-h-[300px] md:min-h-[360px] cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-black/10"
      >
        {/* Red Accent line top */}
        <div className="absolute top-0 left-0 w-full h-1 bg-red-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out z-30" />

        {/* Image Container with telemetry grids */}
        <div className="relative h-64 md:h-72 overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center">

          {/* Tech dot grid overlay behind rider */}
          <div className="absolute inset-0 tech-grid-dots opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Motion-Echo Red Silhouette */}
          <img
            src={img}
            alt={`${riderName} Echo`}
            className="absolute h-full object-contain object-center speed-echo z-0 select-none"
          />

          {/* Main Rider Image */}
          <img
            src={img}
            alt={riderName}
            className="h-full object-contain object-center group-hover:scale-[1.02] transition-transform duration-500 drop-shadow-lg z-10"
            style={{ transform: "translateZ(30px)" }}
          />

          {/* Active telemetry signal lamp */}
          <div className="absolute top-4 left-6 z-20 font-mono text-[9px] text-red-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-2 pulse-glow-dot" />
            LIVE TELEMETRY
          </div>

          {/* Integrated bottom telemetry HUD */}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/85 via-black/50 to-transparent px-6 py-4 z-20 font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex justify-between items-end">
            <div>
              <span className="text-white/40 block text-[8px] uppercase tracking-widest font-bold mb-0.5">VELOCITY</span>
              <span className="text-2xl font-black text-white tracking-tighter">{speed}</span>
              <span className="text-[10px] text-red-500 font-bold ml-1">KM/H</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-white/40 block text-[8px] uppercase tracking-widest font-bold mb-0.5">LEAN</span>
                <span className="font-bold text-white text-xs">{leanAngle}°</span>
              </div>
              <div className="w-12 h-1 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 transition-all duration-100"
                  style={{ width: `${(leanAngle / 90) * 100}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Content Section */}
        <div className="px-6 md:px-14 py-6 md:py-10 flex flex-col justify-between flex-grow" style={{ transform: "translateZ(15px)" }}>
          <div className="mb-4 md:mb-8 pl-0 md:pl-14">
            <span className="font-mono text-[10px] text-gray-400 font-bold tracking-[0.16em] uppercase">{role}</span>
          </div>

          <div className="mt-auto pl-0 md:pl-14">
            <h3 className="text-lg sm:text-xl md:text-2xl font-display font-black leading-[1.05] mb-3 text-black group-hover:text-red-600 transition-colors duration-300">
              {riderName.split(" ").map((n, i) => (
                <span key={i} className="block">
                  {n}
                </span>
              ))}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-5 sm:leading-6 font-body">
              {description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function About({ onSelectRider }) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const riders = [
    {
      riderName: "FRANCESCO BAGNAIA",
      role: "World Champion",
      description: "The reigning World Champion defines precision and consistency. Bagnaia's surgical race management makes him the ultimate benchmark of the modern era.",
      img: "Bagnaia MotoGP Rider.jpg"
    },
    {
      riderName: "JORGE MARTIN",
      role: "Championship Contender",
      description: "Explosive one-lap pace and relentless aggression. Martin pushes his machinery to the absolute limit, establishing himself as a formidable title contender.",
      img: "Jorge Martin MotoGP Rider.jpg"
    },
    {
      riderName: "MARC MARQUEZ",
      role: "The 8-Time Champion",
      description: "A generational talent bringing pure spectacle to the grid. Marquez's ability to extract performance through extreme lean angles remains unmatched.",
      img: "Marc Marquez MotoGP Rider.jpg"
    }
  ];

  return (
    <>
      {/* Official Sponsors Section */}
      <section
        className="w-full bg-white border-b border-neutral-100 flex flex-col items-center justify-center select-none"
        style={{
          marginTop: '80px',
          paddingTop: '80px',
          paddingBottom: '80px'
        }}
      >
        {/* MotoGP Centered Logo */}
        <div className="flex justify-center items-center h-8 sm:h-9 md:h-10" style={{ marginBottom: '36px' }}>
          <img
            src="/mgp-logo-on-dark.svg"
            alt="MotoGP"
            className="h-full object-contain brightness-0 opacity-85 hover:opacity-100 transition-opacity duration-300"
          />
        </div>

        {/* Title */}
        <span
          className="font-display text-[11px] sm:text-[12px] md:text-[13px] font-bold text-gray-400 tracking-[0.25em] uppercase block text-center"
          style={{ marginBottom: '28px' }}
        >
          Official Sponsors
        </span>

        {/* Sponsors Row */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16 max-w-6xl mx-auto px-6">
          {/* Qatar Airways */}
          <div className="flex items-center justify-center h-10 md:h-12">
            <img
              src="/qatar_airways_logos.png"
              alt="Qatar Airways"
              className="max-h-full max-w-full object-contain opacity-90 hover:opacity-100 scale-150 transition-all duration-300"
            />
          </div>

          {/* Tissot */}
          <div className="flex items-center justify-center h-9 md:h-11">
            <img
              src="/tissot_logos.jpg"
              alt="Tissot"
              className="max-h-full max-w-full object-contain opacity-90 hover:opacity-100 scale-125 transition-all duration-300"
            />
          </div>

          {/* Michelin */}
          <div className="flex items-center justify-center h-8 md:h-10">
            <img
              src="/michelin_logos.jpg"
              alt="Michelin"
              className="max-h-full max-w-full object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          {/* BMW M */}
          <div className="flex items-center justify-center h-7 md:h-9">
            <img
              src="/bmwm_logos.png"
              alt="BMW M"
              className="max-h-full max-w-full object-contain opacity-90 hover:opacity-100 scale-90 transition-all duration-300"
            />
          </div>

          {/* Estrella Galicia */}
          <div className="flex items-center justify-center h-10 md:h-12">
            <img
              src="/estrella_galicia_logo.jpg"
              alt="Estrella Galicia"
              className="max-h-full max-w-full object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          {/* DHL */}
          <div className="flex items-center justify-center h-7 md:h-9">
            <img
              src="/dhl_logo.png"
              alt="DHL"
              className="max-h-full max-w-full object-contain opacity-90 hover:opacity-100 scale-90 transition-all duration-300"
            />
          </div>
        </div>
      </section>

      {/* Main About Section */}
      <section id="about" className="section-shell bg-white border-b border-black/5 scroll-mt-28">
        <div className="section-container">

          {/* Clean, Massive Header */}
          <div className="section-header">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="section-eyebrow">
                2026 Season Overview
              </span>
              <h2 className="section-title text-black">
                THE PREMIER<br />
                <span className="font-black text-black">CLASS.</span>
              </h2>
            </motion.div>
          </div>

        {/* Editorial Grid with High-Graphics motion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="section-grid scroll-mt-28"
        >
          {riders.map((rider, index) => (
            <RiderCard
              key={index}
              riderName={rider.riderName}
              role={rider.role}
              description={rider.description}
              img={rider.img}
              onSelect={() => onSelectRider(rider)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  </>
  );
}

