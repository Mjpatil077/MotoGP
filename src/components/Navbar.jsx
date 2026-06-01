import React from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const navItems = [
    { name: "CHAMPIONSHIP", href: "#" },
    { name: "RIDERS", href: "#" },
    { name: "TEAMS", href: "#" },
    { name: "CALENDAR", href: "#" }
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 bg-[#050505]/95 border-b border-white/10 backdrop-blur-md pointer-events-auto shadow-2xl"
    >
      <div className="max-w-[1600px] mx-auto w-full flex justify-between items-center px-8 py-6 md:py-7">
        
        {/* Professional Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <span className="font-display font-black text-white text-lg md:text-2xl tracking-[0.25em] uppercase">
            MOTOGP™
          </span>
        </a>

        {/* Clean Editorial Navigation Items */}
        <nav className="hidden md:flex items-center gap-12">
          {navItems.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="relative font-mono text-xs font-bold text-white/50 hover:text-white tracking-[0.2em] transition-colors duration-300 uppercase py-2 group"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Action Button */}
        <div className="flex items-center">
          <button className="bg-red-600 hover:bg-[#b3000f] text-white font-display text-xs tracking-[0.2em] font-bold uppercase px-8 py-4 transition-all duration-300 pointer-events-auto">
            VIDEOPASS
          </button>
        </div>

      </div>
    </motion.header>
  );
}
