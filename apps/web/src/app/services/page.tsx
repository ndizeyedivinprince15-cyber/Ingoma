'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Camera, Edit3, Mic, PenTool, Video } from 'lucide-react';

type ServiceId = 'video' | 'photography' | 'design' | 'audio' | 'copywriting';

type Service = {
  id: ServiceId;
  title: string;
  icon: React.ReactNode;
  description: string;
  details: string[];
  image?: string;
};

export default function ServicesPage() {
  const servicesData = useMemo<Service[]>(
    () => [
      {
        id: 'video',
        title: 'Cinématographie & Motion Design',
        icon: <Video className="w-6 h-6" />,
        description:
          'Une production visuelle haut de gamme conçue pour captiver votre audience sur tous les écrans.',
        details: [
          'Réalisation de films institutionnels et corporate',
          'Spots publicitaires cinématographiques',
          'Motion design et animations 2D/3D',
          "Captations d'événements en direct (Live Broadcasting)",
        ],
        image: '/media/video.png',
      },
      {
        id: 'photography',
        title: "Photographie d'Art & Studio",
        icon: <Camera className="w-6 h-6" />,
        description:
          "L'art de figer l'excellence. Des clichés haute performance pour immortaliser vos moments et vos produits.",
        details: [
          'Portraits corporate et éditoriaux (Personal Branding)',
          'Photographie de produits et packshot luxe',
          'Couverture événementielle prestigieuse',
          'Retouche haute fidélité et colorimétrie avancée',
        ],
        image: '/media/portfolio/dinner-event.png',
      },
      {
        id: 'design',
        title: 'Direction Artistique & Branding',
        icon: <PenTool className="w-6 h-6" />,
        description:
          'Forgez une identité visuelle inoubliable qui reflète l’excellence de votre marque.',
        details: [
          'Création de logos et identités visuelles sur-mesure',
          'Élaboration de chartes graphiques complètes',
          "Design d'infographies et supports numériques",
          'Retouche photographique Haute Définition',
        ],
        image: '/media/branding.png',
      },
      {
        id: 'audio',
        title: 'Design Sonore & Ingénierie',
        icon: <Mic className="w-6 h-6" />,
        description:
          "L’art de l’invisible. Un son pur et immersif pour donner de la profondeur à votre message.",
        details: [
          'Production et réalisation de podcasts premium',
          "Création d'habillage sonore original",
          'Enregistrements de voix-off professionnelles',
          'Conception et mixage de publicités radio',
        ],
        // choisis une image “sound” ici (exemple) :
        image: '/media/sound/sound-headset-mixer.jpg',
      },
      {
        id: 'copywriting',
        title: 'Copywriting Éditorial',
        icon: <Edit3 className="w-6 h-6" />,
        description:
          'Les mots justes pour sublimer vos images. Un storytelling puissant et persuasif.',
        details: [
          'Écriture de textes optimisés et percutants',
          'Conception-rédaction pour campagnes publicitaires',
          'Storytelling de marque',
          'Accompagnement textuel pour web et réseaux sociaux',
        ],
        image: '/media/apres.png',
      },
    ],
    []
  );

  const [activeId, setActiveId] = useState<ServiceId>(servicesData[0].id);
  const activeService = servicesData.find((s) => s.id === activeId)!;

  return (
    <div className="min-h-screen bg-[#050505] text-[#F9F1D8]/70 py-24 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* fond radial subtil */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),rgba(0,0,0,0)_55%)]" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[#D4AF37]/8 rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-serif text-5xl md:text-7xl text-[#D4AF37] mb-6 tracking-wide drop-shadow"
          >
            Expertises Signature.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-base md:text-xl text-[#F9F1D8]/55 max-w-2xl mx-auto font-light"
          >
            Une production multimédia 360° alliant l’image, le son et le mot — conçue pour l’excellence de vos supports de communication.
          </motion.p>
        </div>

        {/* Layout 2 colonnes */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Tabs */}
          <div className="w-full lg:w-1/3 flex flex-col gap-3">
            {servicesData.map((service) => {
              const active = activeId === service.id;

              return (
                <button
                  key={service.id}
                  onClick={() => setActiveId(service.id)}
                  className={
                    'relative flex items-center gap-4 p-5 md:p-6 text-left rounded-2xl transition-all duration-300 group border ' +
                    (active
                      ? 'bg-zinc-900/70 text-[#D4AF37] border-[#D4AF37]/25 shadow-[0_0_30px_-10px_rgba(212,175,55,0.22)]'
                      : 'bg-white/0 text-[#F9F1D8]/45 border-white/5 hover:border-[#D4AF37]/25 hover:bg-white/5 hover:text-[#F9F1D8]/80')
                  }
                >
                  {active && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#D4AF37] rounded-r-full"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    />
                  )}

                  <div
                    className={
                      'p-3 rounded-xl border transition-colors ' +
                      (active
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37]/25'
                        : 'bg-black/30 border-white/10 group-hover:border-[#D4AF37]/25')
                    }
                  >
                    {service.icon}
                  </div>

                  <span className="font-serif text-lg md:text-xl tracking-wide">
                    {service.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="w-full lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="relative isolate bg-zinc-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-7 md:p-12 h-full overflow-hidden"
              >
               

               <div className="absolute -top-40 -right-40 w-[520px] h-[520px] bg-[#D4AF37]/6 rounded-full blur-[140px] pointer-events-none -z-10" />
                <h2 className="text-3xl md:text-4xl font-serif text-[#F9F1D8] mb-4 drop-shadow">
                  {activeService.title}
                </h2>

                <p className="text-[#F9F1D8]/70 text-lg mb-10 italic drop-shadow">
                  “{activeService.description}”
                </p>

                <div className="space-y-5 relative z-10">
                  {activeService.details.map((detail, index) => (
                    <motion.div
                      key={detail}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 + 0.08 }}
                      className="flex items-start gap-4"
                    >
                      <ArrowRight className="w-5 h-5 text-[#D4AF37]/80 mt-1 shrink-0" />
                      <span className="text-[#F9F1D8]/85 text-lg leading-relaxed drop-shadow">
                        {detail}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 md:mt-16 relative z-10 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/#consultation"
                    className="px-8 py-3 rounded-full border border-[#D4AF37]/45 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 uppercase tracking-widest text-sm font-semibold text-center"
                  >
                    Démarrer un projet
                  </Link>

                  <Link
  href={
    activeService.id === 'photography'
      ? '/portfolio?cat=Photography'
      : activeService.id === 'video'
      ? '/portfolio?cat=Video'
      : activeService.id === 'design'
      ? '/portfolio?cat=Design'
      : activeService.id === 'audio'
      ? '/portfolio?cat=Sound'
      : '/portfolio'
  }
  className="px-8 py-3 rounded-full border border-white/10 text-[#F9F1D8]/80 hover:text-[#F9F1D8] hover:border-[#D4AF37]/25 transition-all duration-300 uppercase tracking-widest text-sm font-semibold text-center"
>
  Voir nos travaux
</Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}