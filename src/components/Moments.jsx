import React from 'react';
import { motion } from 'framer-motion';

export default function Moments() {
  const cards = [
    {
      id: "01",
      title: "QATAR GRAND PRIX",
      subtitle: "LUSAIL INTERNATIONAL CIRCUIT",
      record: "TOP SPEED: 362.4 KM/H (2024)",
      img: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800"
    },
    {
      id: "02",
      title: "GRAN PREMIO D'ITALIA",
      subtitle: "AUTODROMO DEL MUGELLO",
      record: "TOP SPEED: 366.1 KM/H (2023)",
      img: "https://images.unsplash.com/photo-1541348263662-e06836264b97?q=80&w=800"
    },
    {
      id: "03",
      title: "MOTUL TT ASSEN",
      subtitle: "TT CIRCUIT ASSEN",
      record: "POLE LAP: 1:31.340 (2024)",
      img: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=800"
    }
  ];

  return (
    <section className="relative w-full bg-[#f4f4f4] py-48 md:py-64 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden">
      <div className="relative max-w-[1400px] mx-auto w-full z-10">
        
        {/* Section Header */}
        <div className="mb-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-red-600 font-mono text-sm tracking-[0.3em] font-bold uppercase block mb-4">
              The Global Tour
            </span>
            <h2 className="text-5xl md:text-8xl font-display font-light leading-none tracking-tighter text-black">
              ICONIC<br />
              <span className="font-black">CIRCUITS.</span>
            </h2>
          </motion.div>
        </div>

        {/* Gallery Grid - Removed parallax Y shifts to fix severe layout overlaps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col bg-white shadow-xl shadow-black/5 overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative h-[350px] w-full overflow-hidden">
                <img 
                  src={card.img} 
                  alt={card.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                {/* Gradient overlay so text doesn't clash if we put text over image, but we put it below now. */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700" />
              </div>

              {/* Minimal Content Section (No Description) */}
              <div className="p-8 flex flex-col bg-white">
                <h3 className="text-2xl font-display font-black tracking-tighter text-black mb-1">
                  {card.title}
                </h3>
                <p className="font-mono text-[9px] text-gray-500 font-bold tracking-[0.1em] uppercase mb-6">
                  {card.subtitle}
                </p>
                
                <div className="mt-auto border-t border-gray-100 pt-4">
                  <span className="font-mono text-[10px] text-red-600 font-bold tracking-[0.15em] uppercase">
                    {card.record}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
