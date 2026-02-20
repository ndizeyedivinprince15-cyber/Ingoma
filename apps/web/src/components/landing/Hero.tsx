'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-[82vh] w-full bg-[#050505] text-[#F9F1D8] px-4 pt-28 pb-10 overflow-hidden">
      <nav className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center max-w-7xl mx-auto w-full z-10">
        <div className="font-serif text-[#D4AF37] text-xl tracking-widest font-bold">
          HERO
        </div>
        <div className="hidden md:flex gap-8 text-sm text-[#F9F1D8]/70 uppercase tracking-widest">
          <span>Portfolio</span>
          <span>Services</span>
          <span>Contact</span>
        </div>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className={
          'group relative mx-auto w-full max-w-5xl rounded-[38px] overflow-hidden ' +
          'bg-white/5 backdrop-blur-xl ' +
          'ring-1 ring-[#D4AF37]/15 hover:ring-[#D4AF37]/50 ' +
          'shadow-[0_30px_140px_-110px_rgba(0,0,0,0.9)] ' +
          'hover:shadow-[0_0_0_1px_rgba(212,175,55,0.28),0_40px_180px_-120px_rgba(212,175,55,0.20)] ' +
          'transition duration-300'
        }
      >
        <div className="absolute inset-0">
          <img
            src="/media/hero.png"
            alt="Hero event"
            className="h-full w-full object-cover scale-[1.08] blur-[2px] opacity-60 transition duration-700 group-hover:opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/45 to-black/80" />
        </div>

        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />

        <div className="relative px-6 py-16 md:py-20 text-center">
          <h1 className="font-serif text-4xl md:text-6xl leading-tight">
            Architects of Atmosphere.
            <br />
            <span className="text-[#D4AF37]">Masters of the Moment.</span>
          </h1>

          <p className="mt-5 text-[#F9F1D8]/60 text-xs md:text-sm tracking-[0.25em] uppercase">
            Premium multimedia services for high‑stakes events.
          </p>

          <button className="mt-10 px-10 py-4 bg-gradient-to-r from-[#BFA06D] to-[#806815] text-white font-serif tracking-widest uppercase text-xs md:text-sm rounded-sm shadow-[0_10px_30px_-10px_rgba(212,175,55,0.4)] hover:shadow-[0_20px_45px_-10px_rgba(212,175,55,0.55)] transition">
            Book a Consultation
          </button>
        </div>
      </motion.div>
    </section>
  );
}