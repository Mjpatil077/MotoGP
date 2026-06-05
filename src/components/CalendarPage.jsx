import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin, X, ArrowRight } from 'lucide-react';

// ==========================================
// 1. 22 RACES DETAILED SEASON DATASET
// ==========================================
const races = [
  {
    id: "01",
    name: "THAILAND GRAND PRIX",
    circuit: "CHANG INTERNATIONAL CIRCUIT",
    month: "MARCH",
    date: "MAR 01 - MAR 03",
    coords: "14.9961° N, 103.0882° E",
    flag: "TH",
    mapX: 740,
    mapY: 340,
    length: "4.554 KM",
    corners: "12 (5L / 7R)",
    straight: "1000 M",
    pathD: "M 20,50 L 140,50 C 160,50 170,60 170,70 C 170,80 150,90 130,85 L 100,75 C 80,75 60,60 40,65 C 20,70 10,60 20,50 Z"
  },
  {
    id: "02",
    name: "BRAZILIAN GRAND PRIX",
    circuit: "AUTODROMO DE JACAREPAGUA",
    month: "MARCH",
    date: "MAR 15 - MAR 17",
    coords: "22.9754° S, 43.3931° W",
    flag: "BR",
    mapX: 360,
    mapY: 450,
    length: "5.031 KM",
    corners: "11 (7L / 4R)",
    straight: "900 M",
    pathD: "M 40,40 C 60,20 100,30 110,50 C 100,70 80,70 60,60 C 40,50 20,60 40,40 Z"
  },
  {
    id: "03",
    name: "GRAND PRIX OF THE AMERICAS",
    circuit: "CIRCUIT OF THE AMERICAS",
    month: "APRIL",
    date: "APR 05 - APR 07",
    coords: "30.1328° N, 97.6411° W",
    flag: "US",
    mapX: 200,
    mapY: 220,
    length: "5.513 KM",
    corners: "20 (11L / 9R)",
    straight: "1200 M",
    pathD: "M 20,70 L 40,35 L 75,45 L 95,25 L 120,55 L 90,75 L 55,85 Z"
  },
  {
    id: "04",
    name: "GRAN PREMIO DE ESPAÑA",
    circuit: "CIRCUITO DE JEREZ",
    month: "APRIL",
    date: "APR 19 - APR 21",
    coords: "36.7081° N, 6.0342° W",
    flag: "ES",
    mapX: 435,
    mapY: 215,
    length: "4.423 KM",
    corners: "13 (5L / 8R)",
    straight: "607 M",
    pathD: "M 25,60 C 40,20 80,15 110,30 C 130,40 140,25 160,35 C 180,45 180,75 160,85 C 140,95 120,75 100,80 C 80,85 60,95 40,80 Z"
  },
  {
    id: "05",
    name: "GRAND PRIX DE FRANCE",
    circuit: "LE MANS BUGATTI CIRCUIT",
    month: "MAY",
    date: "MAY 03 - MAY 05",
    coords: "47.9519° N, 0.2242° E",
    flag: "FR",
    mapX: 460,
    mapY: 180,
    length: "4.185 KM",
    corners: "14 (5L / 9R)",
    straight: "674 M",
    pathD: "M 30,30 C 50,30 70,10 90,30 C 110,50 140,30 160,50 C 180,70 150,90 120,70 C 90,50 60,70 35,60 C 10,50 10,30 30,30 Z"
  },
  {
    id: "06",
    name: "GRAN PREMIO DE CATALUNYA",
    circuit: "CIRCUIT DE BARCELONA-CATALUNYA",
    month: "MAY",
    date: "MAY 17 - MAY 19",
    coords: "41.5700° N, 2.2611° E",
    flag: "ES",
    mapX: 450,
    mapY: 200,
    length: "4.657 KM",
    corners: "14 (6L / 8R)",
    straight: "1047 M",
    pathD: "M 30,40 C 60,20 90,20 120,40 C 150,60 170,40 180,60 C 170,80 150,70 130,85 C 100,100 60,85 30,40 Z"
  },
  {
    id: "07",
    name: "GRAN PREMIO D'ITALIA",
    circuit: "AUTODROMO DEL MUGELLO",
    month: "JUNE",
    date: "JUN 07 - JUN 09",
    coords: "43.9975° N, 11.3719° E",
    flag: "IT",
    mapX: 500,
    mapY: 190,
    length: "5.245 KM",
    corners: "15 (9R / 6L)",
    straight: "1141 M",
    pathD: "M 20,30 L 170,30 C 190,30 190,50 170,60 C 150,70 140,50 120,65 C 100,80 80,95 60,85 C 40,75 40,50 30,50 C 20,50 10,40 20,30 Z"
  },
  {
    id: "08",
    name: "HUNGARIAN GRAND PRIX",
    circuit: "BALATON PARK CIRCUIT",
    month: "JUNE",
    date: "JUN 14 - JUN 16",
    coords: "47.0125° N, 18.2435° E",
    flag: "HU",
    mapX: 520,
    mapY: 180,
    length: "4.115 KM",
    corners: "16 (6L / 10R)",
    straight: "760 M",
    pathD: "M 35,50 C 50,20 85,15 115,30 C 135,40 145,25 165,35 C 185,45 185,75 165,85 C 145,95 125,75 105,80 Z"
  },
  {
    id: "09",
    name: "CZECH REPUBLIC GP",
    circuit: "AUTOMOTODROM BRNO",
    month: "JUNE",
    date: "JUN 21 - JUN 23",
    coords: "49.2031° N, 16.4444° E",
    flag: "CZ",
    mapX: 510,
    mapY: 170,
    length: "5.403 KM",
    corners: "14 (6L / 8R)",
    straight: "636 M",
    pathD: "M 30,45 C 50,15 90,15 110,45 C 130,75 100,105 80,85 C 60,65 40,75 30,45 Z"
  },
  {
    id: "10",
    name: "DUTCH TT ASSEN",
    circuit: "TT CIRCUIT ASSEN",
    month: "JUNE",
    date: "JUN 28 - JUN 30",
    coords: "52.9586° N, 6.5222° E",
    flag: "NL",
    mapX: 480,
    mapY: 155,
    length: "4.542 KM",
    corners: "18 (12R / 6L)",
    straight: "487 M",
    pathD: "M 25,60 C 40,20 80,15 110,30 C 130,40 140,25 160,35 C 180,45 185,75 160,85 C 140,95 120,75 100,80 C 80,85 60,95 40,80 Z"
  },
  {
    id: "11",
    name: "MOTORRAD GRAND PRIX DEUTSCHLAND",
    circuit: "SACHSENRING",
    month: "JULY",
    date: "JUL 12 - JUL 14",
    coords: "50.7903° N, 12.6908° E",
    flag: "DE",
    mapX: 495,
    mapY: 165,
    length: "3.671 KM",
    corners: "13 (10L / 3R)",
    straight: "700 M",
    pathD: "M 40,55 C 60,35 100,45 120,65 C 100,85 80,85 60,75 C 40,65 20,75 40,55 Z"
  },
  {
    id: "12",
    name: "BRITISH GRAND PRIX",
    circuit: "SILVERSTONE CIRCUIT",
    month: "JULY",
    date: "JUL 26 - JUL 28",
    coords: "52.0786° N, 1.0169° W",
    flag: "GB",
    mapX: 460,
    mapY: 150,
    length: "5.900 KM",
    corners: "18 (8L / 10R)",
    straight: "770 M",
    pathD: "M 20,40 L 150,30 L 170,50 L 140,80 L 80,85 L 50,60 Z"
  },
  {
    id: "13",
    name: "GRAN PREMIO DE ARAGON",
    circuit: "MOTORLAND ARAGON",
    month: "AUGUST",
    date: "AUG 09 - AUG 11",
    coords: "41.0778° N, 0.2078° W",
    flag: "ES",
    mapX: 445,
    mapY: 205,
    length: "5.078 KM",
    corners: "17 (10L / 7R)",
    straight: "968 M",
    pathD: "M 30,30 C 50,20 80,30 100,50 C 80,70 60,70 40,60 C 20,50 10,40 30,30 Z"
  },
  {
    id: "14",
    name: "SAN MARINO GRAND PRIX",
    circuit: "MISANO WORLD CIRCUIT MARCO SIMONCELLI",
    month: "AUGUST",
    date: "AUG 23 - AUG 25",
    coords: "43.9619° N, 12.6844° E",
    flag: "SM",
    mapX: 505,
    mapY: 195,
    length: "4.226 KM",
    corners: "16 (6L / 10R)",
    straight: "530 M",
    pathD: "M 25,60 C 40,20 80,15 110,30 C 130,40 140,25 160,35 C 180,45 185,75 160,85 C 140,95 120,75 100,80 Z"
  },
  {
    id: "15",
    name: "MOTORRAD GRAND PRIX VON ÖSTERREICH",
    circuit: "RED BULL RING",
    month: "AUGUST",
    date: "AUG 30 - SEP 01",
    coords: "47.2197° N, 14.7647° E",
    flag: "AT",
    mapX: 505,
    mapY: 175,
    length: "4.318 KM",
    corners: "10 (3L / 7R)",
    straight: "626 M",
    pathD: "M 20,70 L 60,30 L 150,30 L 170,60 L 130,80 L 60,80 Z"
  },
  {
    id: "16",
    name: "JAPANESE GRAND PRIX",
    circuit: "MOBILITY RESORT MOTEGI",
    month: "SEPTEMBER",
    date: "SEP 13 - SEP 15",
    coords: "36.5342° N, 140.2281° E",
    flag: "JP",
    mapX: 790,
    mapY: 230,
    length: "4.801 KM",
    corners: "14 (6L / 8R)",
    straight: "762 M",
    pathD: "M 30,55 C 50,25 80,25 100,55 C 120,85 100,105 80,95 C 60,85 40,95 30,55 Z"
  },
  {
    id: "17",
    name: "INDONESIAN GRAND PRIX",
    circuit: "PERTAMINA MANDALIKA CIRCUIT",
    month: "SEPTEMBER",
    date: "SEP 27 - SEP 29",
    coords: "8.8951° S, 116.2942° E",
    flag: "ID",
    mapX: 740,
    mapY: 390,
    length: "4.313 KM",
    corners: "17 (6L / 11R)",
    straight: "507 M",
    pathD: "M 20,40 L 150,30 C 170,30 170,50 150,60 C 130,70 120,50 100,65 C 80,80 60,95 40,85 C 20,75 20,50 20,40 Z"
  },
  {
    id: "18",
    name: "AUSTRALIAN GRAND PRIX",
    circuit: "PHILLIP ISLAND CIRCUIT",
    month: "OCTOBER",
    date: "OCT 11 - OCT 13",
    coords: "38.5031° S, 145.2342° E",
    flag: "AU",
    mapX: 820,
    mapY: 460,
    length: "4.448 KM",
    corners: "12 (7L / 5R)",
    straight: "900 M",
    pathD: "M 25,60 C 40,20 80,15 110,30 C 130,40 140,25 160,35 C 180,45 185,75 160,85 C 140,95 120,75 100,80 Z"
  },
  {
    id: "19",
    name: "MALAYSIAN GRAND PRIX",
    circuit: "PETRONAS SEPANG INTERNATIONAL CIRCUIT",
    month: "OCTOBER",
    date: "OCT 25 - OCT 27",
    coords: "2.7608° N, 101.7378° E",
    flag: "MY",
    mapX: 720,
    mapY: 365,
    length: "5.543 KM",
    corners: "15 (5L / 10R)",
    straight: "920 M",
    pathD: "M 20,30 L 160,30 C 180,30 190,45 190,60 C 190,75 170,85 150,80 L 120,70 C 100,65 80,80 65,75 C 50,70 40,55 30,55 C 20,55 10,45 20,30 Z",
    isFinalBattle: true
  },
  {
    id: "20",
    name: "QATAR GRAND PRIX",
    circuit: "LUSAIL INTERNATIONAL CIRCUIT",
    month: "NOVEMBER",
    date: "NOV 08 - NOV 10",
    coords: "25.4897° N, 51.4542° E",
    flag: "QA",
    mapX: 600,
    mapY: 270,
    length: "5.380 KM",
    corners: "16 (10R / 6L)",
    straight: "1068 M",
    pathD: "M 20,80 L 160,80 C 180,80 190,65 190,50 C 190,35 170,25 150,30 L 120,40 C 100,45 80,30 65,35 C 50,40 40,55 30,55 C 20,55 10,65 20,80 Z",
    isFinalBattle: true
  },
  {
    id: "21",
    name: "PORTUGUESE GRAND PRIX",
    circuit: "AUTODROMO INTERNACIONAL DO ALGARVE",
    month: "NOVEMBER",
    date: "NOV 15 - NOV 17",
    coords: "37.2314° N, 8.6258° W",
    flag: "PT",
    mapX: 435,
    mapY: 215,
    length: "4.592 KM",
    corners: "15 (9R / 6L)",
    straight: "970 M",
    pathD: "M 30,50 C 50,30 90,40 100,60 C 90,80 70,80 50,70 C 30,60 10,70 30,50 Z",
    isFinalBattle: true
  },
  {
    id: "22",
    name: "VALENCIA GRAND PRIX",
    circuit: "CIRCUIT RICARDO TORMO",
    month: "NOVEMBER",
    date: "NOV 22 - NOV 24",
    coords: "39.4831° N, 0.6319° W",
    flag: "ES",
    mapX: 448,
    mapY: 212,
    length: "4.005 KM",
    corners: "14 (9L / 5R)",
    straight: "876 M",
    pathD: "M 25,60 C 40,20 80,15 110,30 C 130,40 140,25 160,35 C 180,45 185,75 160,85 C 140,95 120,75 100,80 Z",
    isFinalBattle: true
  }
];

// ==========================================
// 2. VECTOR CONTINENT PATHS (TECHNICAL MAP)
// ==========================================
function VectorContinents() {
  return (
    <g className="stroke-white/10 fill-white/[0.012] stroke-[1] pointer-events-none select-none">
      <path d="M 80,120 L 150,110 L 210,130 L 240,110 L 260,150 L 280,240 L 220,270 L 190,260 L 150,300 L 140,260 L 115,220 L 80,180 Z" />
      <path d="M 150,300 L 180,310 L 210,330 L 240,360 L 270,330 L 320,400 L 370,440 L 330,530 L 290,500 L 260,420 L 240,370 Z" />
      <path d="M 400,120 L 480,110 L 580,90 L 720,100 L 880,110 L 920,150 L 880,250 L 800,290 L 750,250 L 680,260 L 580,240 L 520,280 L 400,210 Z" />
      <path d="M 440,290 L 520,290 L 550,330 L 570,410 L 510,470 L 470,440 L 430,340 Z" />
      <path d="M 760,440 L 830,440 L 850,490 L 770,510 Z" />
      <path d="M 330,60 L 380,70 L 350,100 L 310,90 Z" />
      <path d="M 570,430 L 585,445 L 575,475 L 560,450 Z" />
    </g>
  );
}

// ==========================================
// 3. STATS COUNT-UP HOOK (Hero section)
// ==========================================
function Counter({ target }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress * (2 - progress);
      setCount(Math.floor(ease * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [target]);

  return <span>{count}</span>;
}

// ==========================================
// 4. CHECKPOINT CARD SUB-COMPONENT
// ==========================================
function CheckpointCard({ race, index, isActive, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="race-checkpoint relative flex flex-col items-center cursor-pointer snap-start py-4 w-full max-w-[500px] mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-4 h-4 rounded-full flex items-center justify-center bg-[#050508] border-2 border-white/20 z-20">
        <motion.div 
          animate={{
            scale: isActive ? [1, 1.4, 1] : 1,
            backgroundColor: isActive ? "#e50014" : "#ffffff"
          }}
          transition={{ repeat: isActive ? Infinity : 0, duration: 1.5 }}
          className="w-1.5 h-1.5 bg-white rounded-full" 
        />
      </div>

      <motion.div
        className={`glass-card rounded-md w-full p-6 border-l-4 ${
          race.isFinalBattle ? 'border-l-red-600 border border-red-500/15 shadow-[0_0_15px_rgba(229,0,20,0.15)] bg-red-950/[0.03]' : 'border-l-white/20'
        } pl-8 pr-6 flex flex-col justify-between min-h-[140px] transition-all duration-300 relative overflow-hidden`}
        animate={{
          scale: isHovered ? 1.02 : 1,
          borderColor: isHovered ? "rgba(229, 0, 20, 0.4)" : "rgba(255,255,255,0.07)"
        }}
      >
        <div className="absolute inset-0 tech-grid-dots opacity-[0.03] pointer-events-none" />

        <div className="flex justify-between items-start border-b border-white/5 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-red-500 font-bold bg-red-950/40 px-2 py-0.5 border border-red-900/30 rounded-sm">
              RD {race.id}
            </span>
            <img 
              src={`https://flagcdn.com/w40/${race.flag.toLowerCase()}.png`} 
              alt={race.flag}
              className="w-4 h-3 object-cover opacity-85 rounded-sm border border-white/10"
            />
          </div>
          <span className="font-mono text-[9px] text-white/35 font-bold tracking-widest">
            {race.date}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-left">
            <h3 className={`font-display font-black tracking-wide leading-none text-xl ${isHovered ? 'text-red-500' : 'text-white'} transition-colors duration-300`}>
              {race.name}
            </h3>
            <span className="font-mono text-[10px] text-white/40 block mt-1.5">
              {race.circuit}
            </span>
          </div>

          <div className="h-16 w-24 flex items-center justify-center relative self-end md:self-auto">
            <svg viewBox="0 0 200 120" className="w-full h-full stroke-white/20 fill-none stroke-[1.2] max-w-[80px]">
              <path 
                d={race.pathD}
                fill="none" 
                stroke="rgba(255,255,255,0.15)" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {isHovered && (
                <motion.path 
                  d={race.pathD}
                  fill="none" 
                  stroke="#e50014" 
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              )}
              <circle r="3" fill="#e50014">
                <animateMotion 
                  dur="4s" 
                  repeatCount="indefinite" 
                  path={race.pathD} 
                />
              </circle>
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// 5. DETAIL PREVIEW MODAL
// ==========================================
function RaceDetailModal({ race, onClose }) {
  if (!race) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-full h-full bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
        className="w-full max-w-[620px] bg-[#070b12] border border-white/10 p-6 md:p-8 rounded-lg relative overflow-hidden text-white flex flex-col gap-6 shadow-2xl font-mono"
      >
        <div className="absolute inset-0 tech-grid-dots opacity-[0.03] pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white border border-white/10 hover:border-white/30 p-2 rounded-full cursor-pointer bg-white/5"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-4 pr-10">
          <span className="font-mono text-[9px] text-red-500 font-bold bg-red-950/40 px-2.5 py-1 border border-red-900/30 rounded-sm">
            ROUND {race.id}
          </span>
          <img 
            src={`https://flagcdn.com/w40/${race.flag.toLowerCase()}.png`} 
            alt={race.flag}
            className="w-5 h-3.5 object-cover border border-white/10 rounded-sm"
          />
          <span className="text-[10px] text-white/40 font-bold tracking-widest uppercase">{race.date}</span>
        </div>

        <div className="text-left">
          <h2 className="text-2xl md:text-3xl font-display font-black leading-none uppercase tracking-wide text-white">
            {race.name}
          </h2>
          <span className="text-[10px] text-red-500/75 block mt-1.5 tracking-wider font-bold">
            {race.circuit}
          </span>
        </div>

        <div className="w-full h-44 bg-black/40 border border-white/5 rounded-md flex items-center justify-center relative p-4">
          <svg viewBox="0 0 200 120" className="w-full h-full max-w-[240px] drop-shadow-[0_0_15px_rgba(229,0,20,0.45)]">
            <path 
              d={race.pathD}
              fill="none" 
              stroke="rgba(255,255,255,0.06)" 
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.path 
              d={race.pathD}
              fill="none" 
              stroke="#e50014" 
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
            <circle r="3.5" fill="#ffffff">
              <animateMotion 
                dur="4s" 
                repeatCount="indefinite" 
                path={race.pathD} 
              />
            </circle>
          </svg>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-b border-white/5 py-4 text-left">
          <div>
            <span className="text-white/30 text-[8px] uppercase tracking-wider block">LENGTH</span>
            <span className="font-bold text-white text-sm">{race.length}</span>
          </div>
          <div>
            <span className="text-white/30 text-[8px] uppercase tracking-wider block">CORNERS</span>
            <span className="font-bold text-white text-sm">{race.corners}</span>
          </div>
          <div>
            <span className="text-white/30 text-[8px] uppercase tracking-wider block">STRAIGHT</span>
            <span className="font-bold text-white text-sm">{race.straight}</span>
          </div>
          <div>
            <span className="text-white/30 text-[8px] uppercase tracking-wider block">GPS</span>
            <span className="font-bold text-white text-[9px] truncate block mt-0.5">{race.coords}</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-display text-xs font-black uppercase py-3 tracking-widest transition-colors cursor-pointer rounded-sm"
        >
          CONFIRM SCHEDULE FILE
        </button>
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// 6. MAIN CALENDAR PAGE COMPONENT
// ==========================================
export default function CalendarPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedRace, setSelectedRace] = useState(null);
  const [isHudVisible, setIsHudVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Reset view position to top when page renders
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const checkpoints = document.querySelectorAll('.race-checkpoint');
      let currentActive = 0;
      let minDistance = Infinity;

      checkpoints.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - window.innerHeight / 2.5);
        if (dist < minDistance) {
          minDistance = dist;
          currentActive = index;
        }
      });

      // Safe fallback check for scrolling to the very bottom
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      if (isAtBottom && checkpoints.length > 0) {
        setActiveIndex(checkpoints.length - 1);
      } else {
        setActiveIndex(currentActive);
      }

      // Live HUD Visibility status
      const isPastHero = window.scrollY > window.innerHeight * 0.8;
      const isBeforeFinal = window.innerHeight + window.scrollY < document.documentElement.scrollHeight - window.innerHeight * 1.5;
      setIsHudVisible(isPastHero && isBeforeFinal);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isFinalBattleActive = activeIndex >= 18;
  const activeRace = races[activeIndex] || races[0];

  // Helper to map flag to full country name watermarks
  const getCountryName = (flag) => {
    const mapping = {
      TH: "THAILAND",
      BR: "BRAZIL",
      US: "USA",
      ES: "SPAIN",
      FR: "FRANCE",
      IT: "ITALY",
      HU: "HUNGARY",
      CZ: "CZECHIA",
      NL: "NETHERLANDS",
      DE: "GERMANY",
      GB: "BRITAIN",
      SM: "SAN MARINO",
      AT: "AUSTRIA",
      JP: "JAPAN",
      ID: "INDONESIA",
      AU: "AUSTRALIA",
      MY: "MALAYSIA",
      QA: "QATAR",
      PT: "PORTUGAL"
    };
    return mapping[flag] || "RACE";
  };

  // 1. Calculate deterministic vertical center coordinates Y for each card
  const checkpointY = [];
  let currentY = 150; // top padding offset
  races.forEach((race, idx) => {
    const isFirstInMonth = idx === 0 || races[idx].month !== races[idx - 1].month;
    if (isFirstInMonth) {
      currentY += 120; // Month header height spacing
    }
    checkpointY.push(currentY + 120); // vertical center of a 240px card
    currentY += 280; // card height spacing
  });
  const totalTimelineHeight = currentY + 150; // bottom padding offset

  // 2. Winding path horizontal coordinates X (alternates left/right on desktop, center on mobile)
  const getX = (index) => {
    if (isMobile) return 600;
    return index % 2 === 0 ? 1000 : 200;
  };

  const navigateToHomeHash = (hash) => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
    setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="w-full relative overflow-hidden bg-[#050508] font-mono text-white pointer-events-auto">
      
      {/* A. HERO COVER PAGE */}
      <div className="relative w-full min-h-screen flex flex-col justify-between items-center p-8 text-center select-none bg-[#03060c]">
        <div className="absolute inset-0 opacity-[0.08] flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 1000 600" className="w-full h-full max-w-[1280px]">
            <VectorContinents />
          </svg>
        </div>

        <div className="w-full max-w-[1300px] flex justify-between items-center border-b border-white/5 pb-4 font-mono text-[8px] text-white/35 mt-16">
          <span>THE ROAD TO GLORY // MOTO-ROUTE 2026</span>
          <span className="text-red-500 font-bold animate-pulse">● SIGNAL CONNECTED</span>
        </div>

        <div className="my-auto flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-red-500 font-mono text-xs sm:text-sm font-bold tracking-[0.25em] uppercase block mb-6"
          >
            THE ROAD TO GLORY
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.15 }}
            className="text-[clamp(2.5rem,11vw,6.5rem)] sm:text-8xl md:text-[11rem] font-display font-black leading-none uppercase tracking-wider text-white"
          >
            WORLD TOUR
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="flex flex-row flex-wrap sm:flex-nowrap justify-center gap-6 sm:gap-12 mt-12 font-display font-black text-xl sm:text-2xl text-red-500 border-t border-b border-white/5 py-4 px-4 sm:px-12"
          >
            <div className="text-center sm:text-left">
              <span className="text-white font-mono text-[9px] uppercase tracking-widest block font-bold mb-1 opacity-45">CALENDAR EVENTS</span>
              <Counter target={22} /> RACES
            </div>
            <div className="hidden sm:block border-l border-white/5" />
            <div className="text-center sm:text-left">
              <span className="text-white font-mono text-[9px] uppercase tracking-widest block font-bold mb-1 opacity-45">GLOBAL VISITS</span>
              <Counter target={18} /> NATIONS
            </div>
            <div className="hidden sm:block border-l border-white/5" />
            <div className="text-center sm:text-left">
              <span className="text-white font-mono text-[9px] uppercase tracking-widest block font-bold mb-1 opacity-45">THE CROWN</span>
              <Counter target={1} /> CHAMPION
            </div>
          </motion.div>

          <span className="font-mono text-xs text-white/40 block mt-8 tracking-widest">
            Follow the complete journey around the world.
          </span>
        </div>

        <div className="flex flex-col items-center gap-1.5 font-mono text-[9px] text-white/35 tracking-widest mb-10">
          <span>SCROLL FOR SYSTEM LOGS</span>
          <div className="w-[1.5px] h-12 bg-gradient-to-b from-white/35 to-transparent relative overflow-hidden">
            <motion.div 
              animate={{ y: ["-100%", "100%"] }} 
              transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
              className="absolute left-0 top-0 w-full h-1/2 bg-red-500" 
            />
          </div>
        </div>
      </div>

      {/* B. SEASON TIMELINE LAYOUT */}
      <div className="relative w-full transition-colors duration-700" style={{ backgroundColor: isFinalBattleActive ? '#0f0203' : '#02050a' }}>
        
        {/* Subtle grid and glowing overlay behind the entire timeline */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 tech-grid-dots opacity-[0.035]" />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full filter blur-[80px] transition-colors duration-700 ${
            isFinalBattleActive ? 'bg-red-950/15' : 'bg-blue-950/10'
          }`} />
        </div>

        {/* The timeline container */}
        <div className="relative w-full max-w-[1200px] mx-auto px-4 md:px-8 z-10" style={{ height: `${totalTimelineHeight}px` }}>
          
          {/* Background SVG Winding Path & Visuals */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none hidden md:block z-0"
            viewBox={`0 0 1200 ${totalTimelineHeight}`}
            preserveAspectRatio="none"
          >
            {/* Draw winding line segments */}
            {races.slice(0, races.length - 1).map((r, idx) => {
              const x1 = getX(idx);
              const y1 = checkpointY[idx];
              const x2 = getX(idx + 1);
              const y2 = checkpointY[idx + 1];
              const segmentD = `M ${x1},${y1} L ${x2},${y2}`;
              const isSegmentActive = activeIndex >= idx + 1;

              return (
                <g key={`seg-${idx}`}>
                  {/* Faint static guide line */}
                  <path
                    d={segmentD}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.03)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  {/* Active Red Connection Line */}
                  <motion.path
                    d={segmentD}
                    fill="none"
                    stroke="#e50014"
                    strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: isSegmentActive ? 1 : 0 }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    style={{ filter: "drop-shadow(0 0 6px #e50014)" }}
                  />
                  {/* Pulsing overlay line */}
                  {isSegmentActive && (
                    <motion.path
                      d={segmentD}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      className="racing-line-pulse"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.75 }}
                      transition={{ duration: 0.4 }}
                      style={{ 
                        filter: "drop-shadow(0 0 4px #e50014)",
                        strokeDasharray: "15 85"
                      }}
                    />
                  )}
                </g>
              );
            })}

            {/* Checkpoint nodes, circuit wireframes, and country names */}
            {races.map((r, idx) => {
              const isCurrent = idx === activeIndex;
              const isPassed = idx < activeIndex;
              const x = getX(idx);
              const y = checkpointY[idx];
              const isLeft = idx % 2 !== 0;

              return (
                <g key={`node-${r.id}`}>
                  {/* 1. Country Name Outlined Watermark */}
                  <text
                    x={isLeft ? 60 : 1140}
                    y={y + 55}
                    textAnchor={isLeft ? "start" : "end"}
                    className={`font-display font-black text-4xl tracking-widest transition-all duration-700 fill-none stroke-[1.2] ${
                      isCurrent 
                        ? 'stroke-red-500/25 scale-105' 
                        : 'stroke-white/[0.015]'
                    }`}
                    style={{ transformOrigin: `${isLeft ? 60 : 1140}px ${y + 55}px` }}
                  >
                    {getCountryName(r.flag)}
                  </text>

                  {/* 2. Circuit Wireframe Neon Outline */}
                  <g transform={`translate(${isLeft ? 60 : 940}, ${y - 30}) scale(0.5)`}>
                    <path 
                      d={r.pathD} 
                      fill="none" 
                      stroke={isCurrent ? "#e50014" : "rgba(255, 255, 255, 0.08)"} 
                      strokeWidth="3"
                      style={isCurrent ? { filter: "drop-shadow(0 0 6px #e50014)" } : {}}
                      className="transition-colors duration-500"
                    />
                    {isCurrent && (
                      <circle r="4" fill="#ffffff">
                        <animateMotion dur="4s" repeatCount="indefinite" path={r.pathD} />
                      </circle>
                    )}
                  </g>

                  {/* 3. Checkpoint Node dot */}
                  {/* Future Checkpoint */}
                  {!isCurrent && !isPassed && (
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="5" 
                      fill="rgba(255, 255, 255, 0.03)" 
                      stroke="rgba(255, 255, 255, 0.15)" 
                      strokeWidth="1.2" 
                    />
                  )}

                  {/* Passed Checkpoint */}
                  {isPassed && (
                    <motion.circle 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                      cx={x} 
                      cy={y} 
                      r="4.5" 
                      fill="#e50014" 
                      style={{ filter: "drop-shadow(0 0 4px #e50014)" }}
                    />
                  )}

                  {/* Current Active Checkpoint */}
                  {isCurrent && (
                    <>
                      <motion.circle 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 150, damping: 12 }}
                        cx={x} 
                        cy={y} 
                        r="6" 
                        fill="#ffffff" 
                        style={{ filter: "drop-shadow(0 0 6px #ffffff)" }}
                      />
                      <circle 
                        cx={x} 
                        cy={y} 
                        r="14" 
                        fill="none" 
                        stroke="#e50014" 
                        strokeWidth="1.5" 
                        className="pulse-glow-dot" 
                      />
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Mobile-only central straight timeline line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-white/5 md:hidden z-0" />

          {/* Centered Scrollable Timeline Cards Overlay */}
          {races.map((race, idx) => {
            const isFirstInMonth = idx === 0 || races[idx].month !== races[idx - 1].month;
            const isActive = idx === activeIndex;
            const cardTop = checkpointY[idx] - 120; // Vertically center the card relative to checkpointY

            return (
              <div 
                key={race.id} 
                className="absolute left-1/2 -translate-x-1/2 w-full max-w-[500px] flex justify-center items-center z-10 px-4 race-checkpoint" 
                style={{ 
                  top: `${cardTop}px`,
                  height: '240px'
                }}
              >
                {isFirstInMonth && (
                  <div className="absolute top-[-95px] left-0 right-0 h-[80px] flex flex-col justify-center items-center pointer-events-none select-none">
                    <div className="absolute top-[5px] font-display font-black text-[7vw] sm:text-[5rem] text-white/[0.012] tracking-widest leading-none uppercase text-center w-full">
                      {race.month}
                    </div>
                    <div className="flex items-center justify-center gap-4 relative z-10">
                      <span className={`font-display font-black text-base sm:text-lg tracking-widest border-b-2 pb-0.5 ${
                        race.isFinalBattle ? 'text-red-500 border-b-red-600' : 'text-white border-b-white/20'
                      }`}>
                        {race.month}
                      </span>
                      <span className="font-mono text-[8px] text-white/30 tracking-widest uppercase">
                        CHAPTER // {races.filter(r => r.month === race.month).length} EVENTS
                      </span>
                    </div>
                  </div>
                )}
                
                <CheckpointCard 
                  race={race}
                  index={idx}
                  isActive={isActive}
                  onSelect={() => setSelectedRace(race)}
                />
              </div>
            );
          })}

        </div>
      </div>

      {/* C. THE FINAL BATTLE */}
      <div className="w-full relative min-h-screen bg-gradient-to-b from-[#100305] to-[#250005] py-24 px-6 md:px-12 flex flex-col justify-between items-center text-center select-none relative z-10 border-t border-red-950/20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-red-600/5 filter blur-[60px] pointer-events-none" />

        <div className="w-full max-w-[1300px] flex justify-between items-center border-b border-red-900/10 pb-4 font-mono text-[8px] text-red-500 font-bold tracking-widest mt-10">
          <span>SHOWDOWN STATE ACTIVE</span>
          <span className="timing-flash">● FINAL FOUR // WARN STATUS</span>
        </div>

        <div className="my-auto flex flex-col items-center max-w-[850px]">
          <span className="text-red-500 font-mono text-xs font-bold tracking-[0.3em] uppercase block mb-3">THE FINAL BATTLE</span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black leading-[1.05] uppercase tracking-wide text-white mb-6 animate-pulse">
            CHAMPIONSHIP<br />
            <span className="text-red-600">SHOWDOWN.</span>
          </h2>
          <p className="font-mono text-xs sm:text-[13px] text-white/50 leading-6 max-w-[580px] mb-20">
            Malaysia. Qatar. Portugal. Valencia. The final 4 checkpoints of the journey where calculations end and legends are sealed. 100 points remain. Only one rider will claim the crown.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full mt-24" style={{ marginTop: '100px' }}>
            {races.slice(18).map((r) => (
              <motion.div 
                key={r.id}
                onClick={() => setSelectedRace(r)}
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative bg-gradient-to-b from-red-950/5 to-black/80 border border-red-950/60 hover:border-red-600/50 p-5 rounded-md flex flex-col justify-between min-h-[260px] cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(229,0,20,0.2)] transition-all duration-300 group overflow-hidden"
              >
                {/* Tech corner accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-600/30 group-hover:border-red-500/80 transition-colors" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-red-600/30 group-hover:border-red-500/80 transition-colors" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-red-600/30 group-hover:border-red-500/80 transition-colors" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-600/30 group-hover:border-red-500/80 transition-colors" />
                
                {/* Card tech grid dots pattern */}
                <div className="absolute inset-0 tech-grid-dots opacity-[0.02] pointer-events-none group-hover:opacity-[0.04] transition-opacity" />

                {/* Card Header */}
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5 mb-2.5 z-10 w-full">
                  <span className="font-mono text-[10px] text-red-500 font-bold bg-red-950/40 px-2.5 py-0.5 border border-red-900/30 rounded-sm">
                    RD {r.id}
                  </span>
                  <span className="font-mono text-[10px] text-white/50 tracking-wider font-bold">
                    {r.date.split(" - ")[0]}
                  </span>
                </div>

                {/* Race Title & Circuit */}
                <div className="z-10 text-center flex flex-col items-center justify-center">
                  <h4 className="font-display font-black text-white text-lg tracking-wide group-hover:text-red-500 transition-colors duration-300 uppercase leading-none mb-1">
                    {r.name.replace(" GRAND PRIX", "")}
                    <span className="text-xs text-red-500 font-bold font-mono ml-1">GP</span>
                  </h4>
                  <span className="text-[10px] font-mono text-white/50 block mt-1 uppercase max-w-[200px] leading-tight">
                    {r.circuit}
                  </span>
                </div>

                {/* Circuit SVG Outline & Pulsing Tracker */}
                <div className="h-20 w-full flex items-center justify-center relative my-3 z-10">
                  <svg viewBox="0 0 200 120" className="w-full h-full max-h-[70px] stroke-white/10 fill-none stroke-[1.5] transition-all duration-500 group-hover:stroke-red-500/20">
                    <path 
                      d={r.pathD}
                      fill="none" 
                      stroke="rgba(255,255,255,0.06)" 
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="group-hover:stroke-red-950/40 transition-colors duration-300"
                    />
                    {/* Glowing path trace overlay */}
                    <path 
                      d={r.pathD}
                      fill="none" 
                      stroke="#e50014" 
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        filter: "drop-shadow(0 0 4px #e50014)"
                      }}
                    />
                    {/* Animated scanning dot */}
                    <circle r="3" fill="#ffffff" className="opacity-75 group-hover:opacity-100 group-hover:fill-red-500 transition-all duration-300">
                      <animateMotion 
                        dur="4.5s" 
                        repeatCount="indefinite" 
                        path={r.pathD} 
                      />
                    </circle>
                  </svg>
                </div>

                {/* Micro HUD stats grid */}
                <div className="grid grid-cols-3 gap-1 border-t border-white/5 pt-3 mt-1 z-10 font-mono text-[9px] text-center">
                  <div>
                    <span className="text-white/35 block text-[8px] tracking-wider mb-0.5">LENGTH</span>
                    <span className="font-bold text-white text-[10.5px] group-hover:text-red-500 transition-colors">{r.length.split(" ")[0]}k</span>
                  </div>
                  <div>
                    <span className="text-white/35 block text-[8px] tracking-wider mb-0.5">CORNERS</span>
                    <span className="font-bold text-white text-[10.5px] group-hover:text-red-500 transition-colors">{r.corners.split(" ")[0]}</span>
                  </div>
                  <div>
                    <span className="text-white/35 block text-[8px] tracking-wider mb-0.5">STRAIGHT</span>
                    <span className="font-bold text-white text-[10.5px] group-hover:text-red-500 transition-colors">{r.straight}</span>
                  </div>
                </div>

                {/* Footer flag & details */}
                <div className="flex flex-col items-center justify-center gap-1.5 mt-3 border-t border-white/5 pt-3 z-10 w-full">
                  <div className="flex items-center gap-2 justify-center">
                    <img 
                      src={`https://flagcdn.com/w40/${r.flag.toLowerCase()}.png`} 
                      alt={r.flag}
                      className="w-4 h-2.5 object-cover rounded-sm border border-white/10 group-hover:border-red-500/30 transition-colors"
                    />
                    <span className="text-[8.5px] text-white/40 font-bold group-hover:text-red-500/70 transition-colors tracking-widest uppercase font-mono">
                      TELEMETRY LOCK
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <span className="font-mono text-[8px] text-red-500/35 tracking-widest mt-12">
          FINAL SHOWDOWN SYSTEM CONNECTED // NO BYPASS
        </span>
      </div>

      {/* D. FINAL ROAD TO GLORY SHOWDOWN VIEW */}
      <div className="w-full min-h-screen bg-black flex flex-col justify-between items-center p-8 text-center select-none relative z-10">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
          <svg viewBox="0 0 100 60" className="w-[80%] max-w-[620px] stroke-white fill-none stroke-[0.8]">
            <circle cx="24" cy="40" r="10" />
            <circle cx="76" cy="40" r="10" />
            <path d="M 24,40 L 40,22 L 60,22 L 76,40" />
            <path d="M 40,22 L 48,40 L 76,40" />
            <path d="M 34,22 L 26,15 L 44,12 L 54,22 L 66,22 L 70,14 Z" />
          </svg>
        </div>

        <div className="w-full max-w-[1300px] flex justify-between items-center border-b border-white/5 pb-4 font-mono text-[8px] text-white/35 mt-10">
          <span>SEASON ROAD COMPLETE</span>
          <span>SYSTEM DISCONNECTED</span>
        </div>

        <div className="my-auto flex flex-col items-center">
          <span className="text-red-500 font-mono text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase block mb-3">THE FINAL DESTINATION</span>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-display font-black leading-none uppercase tracking-wide text-white mb-8">
            WHO WILL BE<br />
            <span className="text-red-600">WORLD CHAMP?</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button 
              onClick={() => navigateToHomeHash('#about')}
              className="border border-white/10 hover:border-red-600 text-white font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] px-8 py-4 bg-white/5 hover:bg-red-600/5 transition-all duration-300 rounded-sm flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>EXPLORE RIDERS</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigateToHomeHash('#moments')}
              className="bg-red-600 hover:bg-red-700 text-white font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] px-8 py-4 transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>EXPLORE TRACKS</span>
            </button>
          </div>
        </div>

        <div className="w-full max-w-[1300px] flex justify-between items-center border-t border-white/5 pt-4 pb-2 font-mono text-[8px] text-white/30">
          <span>DUCATI CORSE MOTORSPORT DEPT // EST. 1926</span>
          <span>VALENCIA CIRCUIT FINISH // END</span>
        </div>
      </div>

      {/* Dynamic Fading Telemetry HUD Status Bar */}
      <AnimatePresence>
        {isHudVisible && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-0 left-0 w-full p-4 md:p-5 border-t border-white/5 z-30 font-mono text-[9px] text-white/50 flex justify-between items-end bg-[#050508]/85 backdrop-blur-md select-none"
          >
            <div className="text-left flex flex-col gap-0.5">
              <span className="text-red-500 font-bold tracking-widest text-[8px] uppercase">ACTIVE TELEMETRY STATION</span>
              <span className="text-white text-xs sm:text-sm font-black tracking-wider">{activeRace.name}</span>
              <span className="text-white/40 block text-[10px]">{activeRace.circuit}</span>
            </div>
            <div className="text-right flex flex-col items-end gap-0.5">
              <span className="text-white/30">GPS TRACK COORDINATES</span>
              <span className="text-white font-bold text-[10px] sm:text-xs">{activeRace.coords}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* E. DETAILED PREVIEW MODAL */}
      <AnimatePresence>
        {selectedRace && (
          <RaceDetailModal 
            race={selectedRace} 
            onClose={() => setSelectedRace(null)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}
