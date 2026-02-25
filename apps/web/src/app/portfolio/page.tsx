import Image from 'next/image';
import { Suspense } from 'react';
import PortfolioGrid from '../../components/Portfolio/PortfolioGrid';

export default function PortfolioPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-[#F9F1D8] px-6 pb-20 overflow-hidden">
      {/* Background (flou) */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/media/hero.png"
          alt="Background"
          fill
          className="object-cover brightness-50 blur-2xl"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Glows subtils */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl bg-[#D4AF37]/10" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full blur-3xl bg-[#D4AF37]/10" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full blur-3xl bg-[#D4AF37]/8" />

      {/* ✅ Screen / Carte premium qui englobe tout */}
      <div className="max-w-6xl mx-auto pt-8">
        <div className="relative rounded-[34px] p-[1px] bg-[linear-gradient(120deg,rgba(212,175,55,0.22),rgba(255,255,255,0.05),rgba(212,175,55,0.14))] shadow-[0_40px_180px_-140px_rgba(212,175,55,0.22)]">
          <div className="relative rounded-[33px] overflow-hidden bg-zinc-950/55 backdrop-blur-2xl border border-white/5">
            {/* “dust” overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.14]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 30%, rgba(212,175,55,0.35) 0.6px, transparent 1px),' +
                  'radial-gradient(circle at 80% 40%, rgba(255,255,255,0.18) 0.6px, transparent 1px),' +
                  'radial-gradient(circle at 35% 75%, rgba(212,175,55,0.22) 0.6px, transparent 1px)',
                backgroundSize: '220px 220px, 260px 260px, 300px 300px',
              }}
            />

            {/* sheen line top */}
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-35" />

            <div className="relative px-6 md:px-10 py-10 md:py-12">
              {/* Header de la page */}
              <div className="text-left">
                <h1 className="font-serif text-5xl md:text-7xl text-[#D4AF37]">
                  Nos travaux.
                </h1>
                <p className="mt-3 text-[#F9F1D8]/55 max-w-2xl italic">
                  Une sélection de nos réalisations — pensée comme une exposition privée.
                </p>
              </div>

              {/* ✅ La grille reste à l’intérieur de la carte */}
              <div className="mt-10">
                <Suspense
                  fallback={
                    <div className="text-center text-[#F9F1D8]/50 py-16">
                      Chargement de la galerie…
                    </div>
                  }
                >
                  <PortfolioGrid />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
