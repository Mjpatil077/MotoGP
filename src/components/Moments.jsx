import { useState } from 'react';
import { motion } from 'framer-motion';

function TrackCard({ card, index, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
      className="group flex flex-col bg-white shadow-lg shadow-black/5 overflow-hidden premium-card relative cursor-pointer"
    >
      {/* Red Accent line top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-red-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out z-30" />

      {/* Image Section */}
      <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden bg-black">
        <img 
          src={card.img} 
          alt={card.title} 
          className="absolute inset-0 w-full h-full object-cover transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-102 group-hover:opacity-40"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />

        {/* Dynamic Circuit HUD Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-20 flex flex-col justify-between p-6 text-white font-mono pointer-events-none">
          
          {/* Top row: Track layout caption & Lat/Long */}
          <div className="w-full flex justify-between text-[8px] text-white/40">
            <span className="font-bold tracking-wider text-red-500 uppercase">GPS SYSTEM</span>
            <span>{card.coords}</span>
          </div>

          {/* Center: Glowing Track SVG */}
          <div className="w-full h-32 flex items-center justify-center relative">
            <svg viewBox="0 0 200 120" className="w-full h-full max-w-[160px] drop-shadow-[0_0_6px_rgba(229,0,20,0.4)]">
              {/* Background Path */}
              <path 
                d={card.pathD}
                fill="none" 
                stroke="rgba(255,255,255,0.2)" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Self-tracing path on hover */}
              {isHovered && (
                <motion.path 
                  d={card.pathD}
                  fill="none" 
                  stroke="#e50014" 
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                />
              )}
              {/* Racing Rider Dot */}
              <circle r="3.5" fill="#e50014">
                <animateMotion 
                  dur="4.5s" 
                  repeatCount="indefinite" 
                  path={card.pathD} 
                />
              </circle>
            </svg>
          </div>

          {/* Staggered specs overlay at bottom */}
          <div className="w-full flex justify-between gap-2 text-[9px] text-white/80 border-t border-white/10 pt-2">
            <div>
              <span className="text-white/40 block text-[7px] uppercase tracking-wider">LEN</span>
              <span className="font-bold text-white text-xs">{card.length}</span>
            </div>
            <div>
              <span className="text-white/40 block text-[7px] uppercase tracking-wider">CRN</span>
              <span className="font-bold text-white text-xs">{card.corners}</span>
            </div>
            <div>
              <span className="text-white/40 block text-[7px] uppercase tracking-wider">STR</span>
              <span className="font-bold text-white text-xs">{card.straight}</span>
            </div>
            <div>
              <span className="text-white/40 block text-[7px] uppercase tracking-wider">WID</span>
              <span className="font-bold text-white text-xs">{card.width}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Minimal Content Section (Below Image) */}
      <div className="p-4 sm:p-6 md:p-8 pb-6 sm:pb-8 md:pb-10 flex flex-col bg-white text-center items-center">
        <h3 className="text-lg sm:text-xl md:text-2xl font-display font-black leading-tight text-black mb-3 group-hover:text-red-600 transition-colors duration-300">
          {card.title}
        </h3>
        <p className="mx-auto max-w-[92%] sm:max-w-[88%] font-mono text-[10px] md:text-[11px] text-gray-500 font-bold tracking-[0.12em] uppercase mb-4 leading-5">
          {card.subtitle}
        </p>
        
        <div className="border-t border-gray-100 pt-5 w-full">
          <span className="font-mono text-[10px] md:text-[11px] text-red-600 font-bold tracking-[0.16em] uppercase">
            {card.record}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Moments({ onSelectTrack }) {
  const cards = [
    {
      id: "01",
      title: "QATAR GRAND PRIX",
      subtitle: "LUSAIL INTERNATIONAL CIRCUIT",
      record: "TOP SPEED: 362.4 KM/H (2024)",
      img: "/qatar%20MotoGP%20Track.jpg",
      coords: "25.4897° N, 51.4542° E",
      length: "5.380 KM",
      corners: "16 (10R / 6L)",
      straight: "1068 M",
      width: "12 M",
      pathD: "M 20,80 L 160,80 C 180,80 190,65 190,50 C 190,35 170,25 150,30 L 120,40 C 100,45 80,30 65,35 C 50,40 40,55 30,55 C 20,55 10,65 20,80 Z"
    },
    {
      id: "02",
      title: "GRAN PREMIO D'ITALIA",
      subtitle: "AUTODROMO DEL MUGELLO",
      record: "TOP SPEED: 366.1 KM/H (2023)",
      img: "/GRAN%20PREMIO%20D%27ITALIA%20MotoGP%20Track.jpg",
      coords: "43.9975° N, 11.3719° E",
      length: "5.245 KM",
      corners: "15 (9R / 6L)",
      straight: "1141 M",
      width: "14 M",
      pathD: "M 20,30 L 170,30 C 190,30 190,50 170,60 C 150,70 140,50 120,65 C 100,80 80,95 60,85 C 40,75 40,50 30,50 C 20,50 10,40 20,30 Z"
    },
    {
      id: "03",
      title: "MOTUL TT ASSEN",
      subtitle: "TT CIRCUIT ASSEN",
      record: "POLE LAP: 1:31.340 (2024)",
      img: "/Motul%20TT%20Assen%20MotoGP%20Track.jpg",
      coords: "52.9586° N, 6.5222° E",
      length: "4.542 KM",
      corners: "18 (12R / 6L)",
      straight: "487 M",
      width: "14 M",
      pathD: "M 25,60 C 40,20 80,15 110,30 C 130,40 140,25 160,35 C 180,45 185,75 160,85 C 140,95 120,75 100,80 C 80,85 60,95 40,80 C 20,65 15,70 25,60 Z"
    }
  ];

  return (
    <section id="moments" className="section-shell bg-[#f4f4f4] overflow-hidden border-b border-black/5 scroll-mt-28">
      <div className="section-container">
        
        {/* Section Header */}
        <div className="section-header">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-eyebrow">
              The Global Tour
            </span>
            <h2 className="section-title text-black">
              ICONIC<br />
              <span className="font-black">CIRCUITS.</span>
            </h2>
          </motion.div>
        </div>

        {/* Gallery Grid */}
        <div className="section-grid">
          {cards.map((card, i) => (
            <TrackCard 
              key={card.id} 
              card={card} 
              index={i} 
              onSelect={() => onSelectTrack(card)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

