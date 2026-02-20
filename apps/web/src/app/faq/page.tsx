'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Plus } from 'lucide-react';

const faqData = [
  {
    question: 'Quels sont vos délais de livraison ?',
    answer:
      "Pour la photographie, comptez 7 jours ouvrables pour le traitement et la retouche. Pour les productions vidéo complexes, le délai se situe entre 14 et 21 jours, incluant les allers-retours de validation.",
  },
  {
    question: 'Vous déplacez-vous en dehors de Gitega ?',
    answer:
      "Absolument. Nous couvrons des événements sur tout le territoire national et dans la sous-région. Des frais de déplacement et d'hébergement standard s'appliquent pour les missions hors de la capitale.",
  },
  {
    question: 'Proposez-vous des forfaits personnalisés ?',
    answer:
      "Chaque moment est unique. Bien que nous ayons des collections signatures, nous concevons principalement des offres sur-mesure adaptées à l'envergure, à la durée et aux spécificités techniques de votre projet.",
  },
] as const;

function AccordionItem({
  item,
  isOpen,
  onClick,
}: {
  item: { question: string; answer: string };
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={false}
      className={
        'border rounded-2xl overflow-hidden transition-all duration-500 ease-out backdrop-blur-md ' +
        (isOpen
          ? 'bg-zinc-900/70 border-[#D4AF37]/45 shadow-[0_0_20px_rgba(212,175,55,0.14)]'
          : 'bg-zinc-900/30 border-[#D4AF37]/10 hover:border-[#D4AF37]/25')
      }
    >
      <button
        onClick={onClick}
        className="flex items-center justify-between w-full p-6 text-left focus:outline-none group"
      >
        <span
          className={
            'text-lg font-medium transition-colors duration-300 ' +
            (isOpen ? 'text-[#D4AF37]' : 'text-[#F9F1D8]/85 group-hover:text-[#F9F1D8]')
          }
        >
          {item.question}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: 'anticipate' }}
          className={
            'p-1.5 rounded-full border ' +
            (isOpen
              ? 'border-[#D4AF37]/60 text-[#D4AF37]'
              : 'border-white/10 text-[#F9F1D8]/40')
          }
        >
          <Plus size={18} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-6 pb-6 text-[#F9F1D8]/60 leading-relaxed border-t border-white/5 pt-4">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };


 const whatsappNumber = '25761223536';

  return (
    <section className="relative min-h-screen py-24 bg-[#050505] overflow-hidden flex flex-col items-center justify-center">
      {/* Noise */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-15">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilterFAQ">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilterFAQ)" />
        </svg>
      </div>

      {/* Gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D4AF37]/7 rounded-full blur-[120px] -z-10" />

      <div className="relative z-10 w-full max-w-3xl px-6">
        {/* Title */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">
            Common Inquiries
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto" />
          <p className="mt-4 text-[#F9F1D8]/45 text-xs tracking-[0.25em] uppercase">
            L’excellence dans les détails
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <AccordionItem
              key={item.question}
              item={item}
              isOpen={activeIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* WhatsApp CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 pt-10 border-t border-white/5"
        >
          <div className="bg-gradient-to-br from-zinc-900/70 to-zinc-950/70 border border-[#D4AF37]/18 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 text-center md:text-left">
              <h2 className="text-xl font-serif text-[#F9F1D8] mb-2">
                Encore des questions ?
              </h2>
              <p className="text-[#F9F1D8]/45 text-sm">
                Pour une réponse immédiate, notre concierge est disponible sur WhatsApp.
              </p>
            </div>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 flex items-center gap-3 px-6 py-3 bg-black/40 hover:bg-black/55 border border-white/10 text-[#D4AF37] rounded-full transition-all duration-300 group/btn"
            >
              <MessageCircle size={18} />
              <span className="font-medium">Chatter sur WhatsApp</span>
              <ArrowRight
                size={16}
                className="transform group-hover/btn:translate-x-1 transition-transform"
              />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}