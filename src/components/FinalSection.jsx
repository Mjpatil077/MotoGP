import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function FinalSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setEmail('');
    }
  };

  const socialLinks = [
    { name: "INSTAGRAM", url: "#" },
    { name: "YOUTUBE", url: "#" },
    { name: "TIKTOK", url: "#" },
    { name: "FACEBOOK", url: "#" }
  ];

  return (
    <section className="relative w-full bg-[#050505] pt-64 pb-32 px-6 md:px-12 flex flex-col items-center justify-between border-t border-white/10">
      
      {/* Premium Red Racing Accent Divider */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-red-600 z-20" />
      
      {/* Huge Newsletter CTA */}
      <div className="relative max-w-4xl mx-auto w-full text-center mb-48 z-10">
        
        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-9xl font-display font-light leading-none tracking-tighter mb-8 text-white"
        >
          JOIN THE<br />
          <span className="font-black">GRID.</span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-16 font-body"
        >
          Subscribe to the official MotoGP newsletter for the latest news, exclusive content, and race updates delivered directly to your inbox.
        </motion.p>

        {/* Newsletter Form */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl mx-auto relative"
        >
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row border border-white/20 p-2 bg-[#0a0a0a]">
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none text-white outline-none w-full px-6 py-4 font-body text-base placeholder-white/30"
              />
              <button 
                type="submit"
                className="bg-red-600 hover:bg-[#b3000f] text-white font-display text-xs tracking-widest font-bold uppercase px-10 py-5 transition-colors duration-300 whitespace-nowrap mt-2 sm:mt-0"
              >
                SUBSCRIBE
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#0a0a0a] border border-white/20 p-8 text-center"
            >
              <span className="font-display text-lg text-white font-bold block mb-2 uppercase tracking-wide">
                Welcome to the Grid
              </span>
              <span className="text-base text-white/60 font-body">
                You have successfully subscribed to the official newsletter.
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Massive High-End Footer */}
      <div className="relative w-full max-w-[1400px] mx-auto border-t border-white/10 pt-24 pb-12 flex flex-col md:flex-row justify-between items-center md:items-start gap-12 z-10">
        
        {/* Left Side: Brand name */}
        <div className="flex flex-col gap-4 items-center md:items-start">
          <span className="font-display font-black text-white text-xl tracking-[0.2em] uppercase">
            MOTOGP™
          </span>
          <span className="font-body text-sm text-white/40">
            © 2026 Dorna Sports SL. All rights reserved.
          </span>
        </div>

        {/* Center: Social links grid */}
        <div className="flex flex-wrap justify-center md:justify-start gap-10">
          {socialLinks.map((link, i) => (
            <a 
              key={i} 
              href={link.url}
              className="font-mono text-[11px] font-bold text-white/40 hover:text-white tracking-[0.2em] uppercase transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Side: Links */}
        <div className="flex gap-8 font-mono text-[11px] font-bold text-white/40 uppercase tracking-[0.2em]">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
        </div>

      </div>
    </section>
  );
}
