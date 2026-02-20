'use client';

import LiquidMagneticButton from './LiquidMagneticButton';

export default function ConsultationCTA() {
  return (
    <section id="consultation" className="mx-auto w-full max-w-6xl px-6 pb-20">
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10 shadow-[0_40px_140px_-100px_rgba(34,211,238,0.55)]">
        <h3 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-zinc-100 leading-[1.02]">
          Prêt à rehausser votre prochain événement ?
        </h3>
        <p className="mt-3 text-zinc-300 max-w-2xl">
          On fixe un brief clair, on sécurise la production, et on livre un rendu premium.
          Objectif : une expérience spectaculaire, sans friction.
        </p>

        <div className="mt-7 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <LiquidMagneticButton href="https://calendly.com/" newTab>
            Book a Consultation
          </LiquidMagneticButton>

          <a
            href="mailto:contact@votre-agence.com"
            className="rounded-2xl px-6 py-4 text-sm md:text-base font-semibold text-zinc-200 border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition"
          >
            contact@votre-agence.com
          </a>
        </div>

        <div className="mt-6 text-xs text-zinc-500">
          Remplace le lien Calendly + l’email par ceux du client.
        </div>
      </div>
    </section>
  );
}