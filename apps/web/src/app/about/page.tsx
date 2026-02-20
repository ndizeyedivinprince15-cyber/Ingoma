'use client';

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Aperture,
  Camera,
  Mic,
  ShieldCheck,
  Star,
  Video,
  Zap,
} from 'lucide-react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const, // ✅ tuple (pas number[])
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F9F1D8]/80 font-sans selection:bg-[#D4AF37]/30 selection:text-white overflow-hidden relative">
      {/* Noise / dust */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-15">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.6"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Gold glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[#D4AF37]/10 rounded-full blur-[140px] -z-10" />

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28">
        {/* HERO */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-24 md:mb-32"
        >
          <h1 className="text-5xl md:text-7xl font-serif text-center mb-16 text-[#D4AF37] drop-shadow-sm">
            Notre voyage. Votre histoire.
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative group">
              <div className="absolute inset-0 border border-[#D4AF37]/25 rounded-2xl transform translate-x-3 translate-y-3 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
              <div className="relative h-[480px] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/40">
                {/*  */}
                <img
                  src="/media/hero.png"
                  alt="Prince Multimunenia"
                  className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              </div>
            </div>

            {/* Texte */}
            <div className="space-y-6 md:pl-6">
              <h2 className="text-3xl font-serif text-[#D4AF37]">
                Notre Histoire
              </h2>

              <p className="text-lg leading-relaxed text-[#F9F1D8]/65">
                Fondée sur la conviction que chaque image doit capturer une
                éternité, notre agence est née de la fusion entre l’art
                classique et la technologie moderne.
              </p>

              <p className="text-lg leading-relaxed text-[#F9F1D8]/65">
                Nous ne nous contentons pas de documenter ; nous sublimons le
                réel. De la scène aux détails, notre objectif est toujours le
                même : transmettre une émotion premium, propre, intemporelle.
              </p>

              <div className="pt-3">
                <span className="font-serif italic text-[#D4AF37]/80 text-xl">
                  “L’art de voir l’invisible.”
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* VALUES */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-120px' }}
          variants={staggerContainer}
          className="mb-24 md:mb-32"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Innovation',
                icon: <Zap className="w-6 h-6 text-[#D4AF37] mb-4" />,
                desc: "Toujours à l’avant-garde — sans sacrifier l’élégance.",
              },
              {
                title: 'Excellence',
                icon: <Star className="w-6 h-6 text-[#D4AF37] mb-4" />,
                desc: 'La finition est notre signature : net, premium, cohérent.',
              },
              {
                title: 'Fiabilité',
                icon: (
                  <ShieldCheck className="w-6 h-6 text-[#D4AF37] mb-4" />
                ),
                desc: 'Timing cadré, process clair, livraisons fiables.',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="backdrop-blur-md bg-white/5 border border-[#D4AF37]/25 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300 relative overflow-hidden group shadow-[0_0_18px_rgba(212,175,55,0.08)] hover:shadow-[0_0_28px_rgba(212,175,55,0.16)]"
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
                {value.icon}
                <h3 className="text-2xl font-serif text-[#F9F1D8] mb-2">
                  {value.title}
                </h3>
                <p className="text-[#F9F1D8]/60 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* GEAR */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-24 md:mb-32"
        >
          <h2 className="text-4xl font-serif text-center mb-12 text-[#D4AF37]">
            Équipement de Pointe
            <div className="w-24 h-[2px] bg-[#D4AF37]/50 mx-auto mt-4 rounded-full" />
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Lentille Cinéma', icon: <Aperture size={46} /> },
              { name: 'Caméra 8K', icon: <Camera size={46} /> },
              { name: 'Mixeur Audio', icon: <Mic size={46} /> },
              { name: 'Éclairage Studio', icon: <Video size={46} /> },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="aspect-square relative bg-zinc-900/40 border border-[#D4AF37]/18 rounded-2xl flex flex-col items-center justify-center group cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/65" />
                <div className="z-10 text-[#F9F1D8]/35 group-hover:text-[#D4AF37]/90 transition-colors duration-300">
                  {item.icon}
                </div>

                <div className="absolute bottom-6 z-10 bg-black/70 border border-white/10 px-4 py-1 rounded-full text-[11px] text-[#D4AF37] uppercase tracking-widest shadow-lg">
                  {item.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center py-14 relative"
        >
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent" />

          <h2 className="text-4xl md:text-5xl font-serif text-[#F9F1D8] mb-8 mt-10">
            À la rencontre de nos maîtres.
          </h2>

          <motion.a
            href="/#consultation"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center group relative px-10 py-4 bg-gradient-to-r from-[#BFA06D] to-[#806815] text-black font-bold tracking-wider uppercase text-sm rounded-full shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_40px_rgba(212,175,55,0.45)] transition-shadow duration-300 overflow-hidden"
          >
            <span className="relative z-10">Book a Consultation</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          </motion.a>
        </motion.section>
      </main>

      <footer className="text-center py-6 text-[#F9F1D8]/35 text-xs border-t border-white/5">
        &copy; {new Date().getFullYear()} Prince Multimunenia. Tous droits réservés.
      </footer>
    </div>
  );
}