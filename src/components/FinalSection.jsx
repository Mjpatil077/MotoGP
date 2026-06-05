import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function FinalSection() {
  const socialLinks = [
    { name: "Instagram", url: "#" },
    { name: "YouTube", url: "#" },
    { name: "TikTok", url: "#" },
    { name: "Facebook", url: "#" }
  ];

  const handleBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <footer className="section-shell bg-[#050505] border-t border-white/5 pt-20 pb-4 relative overflow-hidden select-none">
      {/* Premium Red Accent Line Top */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-red-600" />

      {/* Technical Dot Pattern Overlay */}
      <div className="absolute inset-0 tech-grid-dots opacity-[0.02] pointer-events-none z-0" />

      {/* Main Grid Layout */}
      <div className="section-container relative z-10 w-full">
        {/* Top Footer Callout */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-10">
          <div className="text-center md:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2rem,8vw,4.5rem)] font-display font-light leading-[0.95] text-white tracking-wide"
            >
              JOIN THE <span className="font-black text-red-600">GRID.</span>
            </motion.h2>
            <p className="font-mono text-[10px] text-white/40 tracking-widest mt-2 uppercase">
              MotoGP Telemetry Station // Est. 2026
            </p>
          </div>

          {/* Symmetrical Back to top button - Hidden on Mobile */}
          <button
            onClick={handleBackToTop}
            className="hidden md:flex items-center gap-2 font-mono text-[9px] font-bold text-white/45 hover:text-white uppercase tracking-[0.2em] transition-all border border-white/10 hover:border-red-600 px-6 py-3.5 bg-white/[0.02] hover:bg-red-600/5 cursor-pointer rounded-sm"
          >
            <span>Back to top</span>
            <ArrowUp size={12} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Separator Divider with custom spacing */}
        <div className="w-full h-[1px] bg-white/5 mb-16 md:mb-20" />

        {/* Links & Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 pb-12 border-b border-white/5 text-left">
          {/* Column 1: Brand & Status */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4 items-center md:items-start text-center md:text-left">
            <img 
              src="/mgp-logo-on-dark.svg" 
              alt="MotoGP Logo" 
              className="h-8 md:h-10 w-auto object-contain" 
            />
            <p className="font-body text-xs text-white/45 leading-5 max-w-[240px]">
              The pinnacle of motorcycle racing telemetry. Experience pure adrenaline, speed data logs, and historic champions statistics.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-3 items-start">
            <span className="font-mono text-[9px] text-red-500 font-bold tracking-[0.18em] uppercase">Navigation</span>
            <div className="flex flex-col gap-2 font-mono text-[10px] font-bold text-white/40 uppercase tracking-widest">
              <a href="#top" className="hover:text-white transition-colors">Home</a>
              <a href="#about" className="hover:text-white transition-colors">Riders</a>
              <a href="#moments" className="hover:text-white transition-colors">Tracks</a>
              <a href="#calendar" className="hover:text-white transition-colors">Calendar</a>
            </div>
          </div>

          {/* Column 3: Social Connections */}
          <div className="flex flex-col gap-3 items-start">
            <span className="font-mono text-[9px] text-red-500 font-bold tracking-[0.18em] uppercase">Social Networks</span>
            <div className="flex flex-col gap-2 font-mono text-[10px] font-bold text-white/40 uppercase tracking-widest">
              {socialLinks.map((link, i) => (
                <a key={i} href={link.url} className="hover:text-white transition-colors">
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Legal & System Info */}
          <div className="flex flex-col gap-3 items-start">
            <span className="font-mono text-[9px] text-red-500 font-bold tracking-[0.18em] uppercase">Telemetry System</span>
            <div className="flex flex-col gap-2 font-mono text-[10px] font-bold text-white/40 uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            </div>
            <div className="pt-2 text-[8px] text-white/20 border-t border-white/5 flex flex-col gap-0.5 mt-1 font-mono items-start">
              <span>STATUS: OFFLINE SCANNING</span>
              <span>LATENCY: 0.00ms</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="flex flex-col items-center justify-center pt-8 gap-2 font-mono text-center">
          <span className="text-[10px] text-white/35">© 2026 Copyrights Reserved.</span>
          <span className="text-[9px] text-red-500 font-bold tracking-[0.18em] uppercase">Developed by Tarkshy Consultancy Services .</span>
        </div>
      </div>
    </footer>
  );
}
