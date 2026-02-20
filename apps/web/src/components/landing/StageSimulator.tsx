'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import ComparisonSlider from './ComparisonSlider';

const tabs = ['PHOTOGRAPHIE', 'VIDÉOGRAPHIE', 'DESIGN', 'SON & LUMIÈRE'];

export default function StageSimulator() {
  const [active, setActive] = useState('PHOTOGRAPHIE');

  return (
    <section id="stage" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Notre Expertise</h2>
        <p className="text-zinc-400">Découvrez la différence entre l'ordinaire et le spectaculaire.</p>
      </div>
      
      {/* Onglets */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border ${
              active === tab 
                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                : 'bg-zinc-900/50 text-zinc-400 border-white/10 hover:border-white/30'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Contenu Dynamique */}
      <div className="w-full min-h-[500px] rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-sm p-6 relative overflow-hidden">
        
        {/* PANNEAU PHOTO - SLIDER AVANT/APRÈS */}
        {active === 'PHOTOGRAPHIE' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold text-white">Retouche Haute Couture</h3>
              <p className="text-sm text-zinc-400">Glissez pour voir la magie de la post-production.</p>
            </div>
            <div className="w-full max-w-4xl mx-auto">
              <ComparisonSlider />
            </div>
          </motion.div>
        )}

        {/* PANNEAU VIDÉO */}
        {active === 'VIDÉOGRAPHIE' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col md:flex-row gap-8 items-center justify-center">
             <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img src="/media/video-service.jpg" className="w-full h-full object-cover" alt="Videographer" />
             </div>
             <div className="w-full md:w-1/2 space-y-4">
                <h3 className="text-3xl font-bold text-white">Captation Cinématographique</h3>
                <p className="text-zinc-300">Stabilisation parfaite, color grading cinéma et narration émotionnelle. Nous ne filmons pas juste votre événement, nous racontons son histoire.</p>
             </div>
          </motion.div>
        )}

        {/* PANNEAU DESIGN */}
        {active === 'DESIGN' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
             <div className="order-2 md:order-1 space-y-4">
                <h3 className="text-3xl font-bold text-white">Identité Visuelle Premium</h3>
                <p className="text-zinc-300">Du logo projeté sur scène aux menus sur table. Une cohérence graphique absolue pour un branding de luxe.</p>
             </div>
             <div className="order-1 md:order-2 w-full h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img src="/media/branding-display.jpg" className="w-full h-full object-cover" alt="Branding" />
             </div>
          </motion.div>
        )}

        {/* PANNEAU SON */}
        {active === 'SON & LUMIÈRE' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full relative rounded-2xl overflow-hidden min-h-[400px]">
             <img src="/media/tech-setup.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Tech Setup" />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
             <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-3xl font-bold text-white">Ingénierie Technique</h3>
                <p className="text-zinc-300 max-w-lg">Son cristallin et éclairage d'ambiance millimétré. La technique s'efface pour laisser place à l'émotion.</p>
             </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}