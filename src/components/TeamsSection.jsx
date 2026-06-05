import { useState } from 'react';
import { motion } from 'framer-motion';

const teamsData = [
  {
    name: 'Ducati Lenovo Team',
    brand: 'Ducati',
    color: '#E50014',
    riders: ['Francesco Bagnaia', 'Marc Márquez'],
    logo: '/logo-ducati-lenovo-team.webp'
  },
  {
    name: 'Aprilia Racing',
    brand: 'Aprilia',
    color: '#E50014',
    riders: ['Jorge Martín', 'Marco Bezzecchi'],
    logo: '/logo-ducati-aprilia-racing-team.png'
  },
  {
    name: 'Red Bull KTM Factory Racing',
    brand: 'KTM',
    color: '#FF5722',
    riders: ['Brad Binder', 'Pedro Acosta'],
    logo: '/redbull_ktm_factory_racing_motogp_team_logo.webp'
  },
  {
    name: 'Monster Energy Yamaha MotoGP',
    brand: 'Yamaha',
    color: '#005aff',
    riders: ['Fabio Quartararo', 'Alex Rins'],
    logo: '/monster_energy_yamaha_racing_team.png'
  },
  {
    name: 'Prima Pramac Yamaha',
    brand: 'Yamaha',
    color: '#800080',
    riders: ['Toprak Razgatlıoğlu', 'Jack Miller'],
    logo: '/prima_pramac_yamaha_motogp_logo_team.png'
  },
  {
    name: 'Trackhouse Racing',
    brand: 'Aprilia',
    color: '#0082c8',
    riders: ['Raúl Fernández', 'Ai Ogura'],
    logo: '/trackhouse_motogp_team_logo.png'
  },
  {
    name: 'Gresini Racing MotoGP',
    brand: 'Ducati',
    color: '#9FA8DA',
    riders: ['Álex Márquez', 'Fermín Aldeguer'],
    logo: '/bk8-gresini-racing-team.png'
  },
  {
    name: 'Honda HRC (Castrol)',
    brand: 'Honda',
    color: '#00B050',
    riders: ['Luca Marini', 'Joan Mir'],
    logo: '/Honda_HRC_Castrol_logo.png'
  },
  {
    name: 'Pertamina Enduro VR46',
    brand: 'Ducati',
    color: '#FFEB3B',
    riders: ['Fabio Di Giannantonio', 'Franco Morbidelli'],
    logo: '/Pertamina_Enduro_VR46_Racing_Team_.jpg'
  },
  {
    name: 'LCR Honda',
    brand: 'Honda',
    color: '#D50000',
    riders: ['Johann Zarco', 'Diogo Moreira'],
    logo: '/lcr_honda_team.png'
  },
  {
    name: 'Red Bull KTM Tech3',
    brand: 'KTM',
    color: '#FF5722',
    riders: ['Maverick Viñales', 'Enea Bastianini'],
    logo: '/redbull_ktm_tech3_team_logo.png'
  }
];

function TeamCard({ team }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative glass-card border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] p-5 rounded-md transition-all duration-300 flex flex-col justify-between items-center text-center overflow-hidden"
    >
      {/* Decorative Brand Color Line */}
      <div 
        className="absolute top-0 left-0 w-full h-[3px] transition-transform duration-500 origin-left scale-x-50 group-hover:scale-x-100"
        style={{ backgroundColor: team.color }}
      />

      {/* Brand Watermark */}
      <div 
        className="absolute -bottom-6 -right-6 font-display font-black text-[5.5rem] leading-none pointer-events-none select-none transition-all duration-500 opacity-[0.015] group-hover:opacity-[0.04] group-hover:scale-105"
        style={{ color: team.color }}
      >
        {team.brand}
      </div>

      {/* Content */}
      <div className="z-10 w-full flex flex-col items-center">
        {/* Styled Logo Container */}
        <div className="h-28 w-full bg-white/[0.01] border border-white/5 rounded-md flex items-center justify-center p-4 overflow-hidden mb-4 transition-all duration-300 group-hover:bg-white/[0.03] group-hover:border-white/10 relative">
          <img 
            src={team.logo} 
            alt={`${team.name} Logo`} 
            className="max-h-full max-w-full object-contain group-hover:scale-[1.03] transition-transform duration-500 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]" 
          />
        </div>

        <span className="font-mono text-[8px] text-white/30 tracking-[0.2em] uppercase font-bold block mb-1 text-center">
          {team.brand} MANUFACTURER
        </span>

        <h3 className="font-display font-black text-sm uppercase text-white transition-colors leading-tight mb-3 tracking-wider text-center">
          {team.name}
        </h3>
      </div>

      {/* Riders List */}
      <div className="mt-auto w-full pt-3.5 border-t border-white/5 z-10 flex flex-col items-center">
        <span className="font-mono text-[8px] text-white/30 uppercase tracking-[0.16em] block mb-2 font-bold text-center">
          2026 Grid Riders
        </span>
        <div className="flex flex-col items-center justify-center gap-1.5 w-full">
          {team.riders.map((rider, i) => (
            <div key={i} className="flex items-center justify-center gap-2 font-mono text-[11px] text-white/70 group-hover:text-white transition-colors duration-300">
              <span 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: team.color }}
              />
              <span>{rider}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ambient background glow on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500 pointer-events-none blur-[35px] rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${team.color} 0%, transparent 70%)`
        }}
      />
    </motion.div>
  );
}

export default function TeamsSection() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section id="teams" className="section-shell bg-black border-b border-white/5 scroll-mt-28 relative">
      <div className="absolute inset-0 tech-grid-dots opacity-10 pointer-events-none" />

      <div className="section-container">
        
        {/* Header */}
        <div className="section-header">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-150px' }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-eyebrow">
              MotoGP™ 2026 Lineups
            </span>
            <h2 className="section-title text-white">
              OFFICIAL GARAGES.<br />
              <span className="font-black text-red-600">THE CONSTRUCTORS.</span>
            </h2>
          </motion.div>
        </div>

        {/* Grid of Team Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {teamsData.map((team, idx) => (
            <TeamCard 
              key={idx}
              team={team}
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
