import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function About() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

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
    <section className="relative w-full bg-white py-48 md:py-64 px-6 md:px-12 flex flex-col items-center justify-center">
      <div className="relative max-w-[1400px] mx-auto w-full z-10">
        
        {/* Clean, Massive Header */}
        <div className="mb-32 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-red-600 font-mono text-sm tracking-[0.3em] font-bold uppercase block mb-6">
              2024 Season Overview
            </span>
            <h2 className="text-6xl md:text-9xl font-display font-light leading-none tracking-tighter text-black">
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
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {/* Card 1 */}
          <motion.div variants={itemVariants} className="group relative overflow-hidden bg-gray-50 border border-gray-200 p-10 flex flex-col justify-between min-h-[400px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
            
            <div className="mb-8">
              <span className="font-mono text-[11px] text-gray-400 font-bold tracking-[0.2em] uppercase">World Champion</span>
            </div>
            
            <div className="mt-auto">
              <h3 className="text-3xl font-display font-black tracking-tighter mb-4 text-black group-hover:text-red-600 transition-colors duration-300">
                FRANCESCO<br/>BAGNAIA
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-body">
                The reigning World Champion defines precision and consistency. Bagnaia's surgical race management makes him the ultimate benchmark of the modern era.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className="group relative overflow-hidden bg-gray-50 border border-gray-200 p-10 flex flex-col justify-between min-h-[400px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
            
            <div className="mb-8">
              <span className="font-mono text-[11px] text-gray-400 font-bold tracking-[0.2em] uppercase">Championship Contender</span>
            </div>
            
            <div className="mt-auto">
              <h3 className="text-3xl font-display font-black tracking-tighter mb-4 text-black group-hover:text-red-600 transition-colors duration-300">
                JORGE<br/>MARTIN
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-body">
                Explosive one-lap pace and relentless aggression. Martin pushes his machinery to the absolute limit, establishing himself as a formidable title contender.
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} className="group relative overflow-hidden bg-gray-50 border border-gray-200 p-10 flex flex-col justify-between min-h-[400px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
            
            <div className="mb-8">
              <span className="font-mono text-[11px] text-gray-400 font-bold tracking-[0.2em] uppercase">The 8-Time Champion</span>
            </div>
            
            <div className="mt-auto">
              <h3 className="text-3xl font-display font-black tracking-tighter mb-4 text-black group-hover:text-red-600 transition-colors duration-300">
                MARC<br/>MARQUEZ
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-body">
                A generational talent bringing pure spectacle to the grid. Marquez's ability to extract performance through extreme lean angles remains unmatched.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
