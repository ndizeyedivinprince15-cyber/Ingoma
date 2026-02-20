'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type Service = {
  id: string;
  title: string;
  description: string;
  imageSrc: string; 
};

function ServiceCard({
  id,
  title,
  description,
  imageSrc,
  delay,
}: Service & { delay: number }) {
  return (
    <motion.section
      id={id}
      className="group relative flex flex-col md:flex-row items-center bg-zinc-900/40 backdrop-blur-xl border border-[#D4AF37]/20 rounded-3xl p-6 md:p-10 shadow-lg mb-8 md:mb-12 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay }}
      whileHover={{
        boxShadow: '0 0 25px rgba(212,175,55,0.18)',
      }}
    >
      
      <div className="flex-1 text-center md:text-left md:pr-10 mb-6 md:mb-0">
        <h2 className="font-serif text-4xl text-[#D4AF37] mb-4 tracking-wide">
          {title}
        </h2>
        <p className="font-sans text-zinc-300 text-lg leading-relaxed mb-6">
          {description}
        </p>

        <a
          href="/#consultation"
          className="inline-flex items-center justify-center relative px-8 py-3 rounded-full overflow-hidden font-sans text-lg font-medium text-white transition-all duration-500 ease-out hover:shadow-lg border border-[#D4AF37]/25"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#BFA06D] to-[#806815] opacity-90" />
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-[#D4AF37] to-[#6b560f]" />
          <span className="relative z-10">Découvrir nos réalisations</span>
        </a>
      </div>

      {/* Image */}
      <div className="flex-shrink-0 w-full md:w-2/5">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-white/10">
          <Image
            src={imageSrc}
            alt={`Illustration du service ${title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        </div>
      </div>
    </motion.section>
  );
}

export default function ServicesPage() {
  const services: Service[] = [
    {
      id: 'photography',
      title: 'Photography',
      description:
        "Capturez l'essence de chaque instant avec une maîtrise artistique inégalée. De la lumière naturelle aux scènes grandioses, chaque cliché devient un visuel premium.",
      imageSrc: '/media/apres.png',
    },
    {
      id: 'videography',
      title: 'Vidéography',
      description:
        "Racontez votre histoire avec une production cinématographique immersive. Captation, aftermovie, storytelling — un rendu qui fait revivre l’énergie de l’événement.",
      imageSrc: '/media/video.png',
    },
    {
      id: 'graphic-design',
      title: 'Graphic Design',
      description:
        "Élevez votre marque avec des créations visuelles sophistiquées : branding événementiel, habillages, supports et cohérence haut de gamme sur chaque point de contact.",
      imageSrc: '/media/branding.png',
    },
    {
      id: 'sound-engineering',
      title: 'Sound Engineering',
      description:
        "Assurez une expérience sonore impeccable. Clarté, présence, équilibre — une régie propre pour que chaque mot et chaque moment soient parfaitement ressentis.",
      imageSrc: '/media/tech.png',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden pt-24 pb-16">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/media/hero.png"
          alt="Elegant event background"
          fill
          className="object-cover brightness-50 blur-2xl"
          quality={80}
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="font-serif text-5xl md:text-6xl text-center text-[#D4AF37] mb-16 mt-8 tracking-wide drop-shadow-lg"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Crafting Unforgettable Moments.
          <br />
          Your Expertise, Your Vision.
        </motion.h1>

        <div className="space-y-12">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              {...service}
              delay={index * 0.12}
            />
          ))}
        </div>
      </main>

      {/* Navigation à gauche */}
      <div className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
        <ul className="space-y-4">
          {services.map((service) => (
            <li key={service.id}>
              <a
                href={`#${service.id}`}
                className="block w-3 h-3 rounded-full bg-[#D4AF37]/35 hover:bg-[#D4AF37] transition-all duration-300 transform hover:scale-150 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                aria-label={`Aller à ${service.title}`}
              />
            </li>
          ))}
        </ul>
      </div>

      <footer className="relative z-10 text-center text-zinc-500 text-sm mt-20">
        &copy; {new Date().getFullYear()} Agence Multimédia. All rights reserved.
      </footer>
    </div>
  );
}