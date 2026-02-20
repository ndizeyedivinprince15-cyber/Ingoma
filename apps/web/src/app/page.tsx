import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const whatsapp = 'https://wa.me/25769034965';

  return (
    <main className="bg-[#050505] text-[#F9F1D8]">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/media/hero.png"
            alt="Ingoma Creative Hub"
            fill
            priority
            className="object-cover opacity-55 blur-[2px] scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/65 to-black/90" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-6xl leading-tight">
              Architects of Atmosphere.
              <br />
              <span className="text-[#D4AF37]">Masters of the Moment.</span>
            </h1>

            <p className="mt-5 text-[#F9F1D8]/65 text-base md:text-lg leading-relaxed">
              Agence multimédia premium basée à <span className="text-[#D4AF37]/90">Gitega</span>.
              Photographie, vidéographie, design, sonorisation et copywriting — pour des projets à enjeux élevés.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/services"
                className="px-8 py-3 rounded-full border border-[#D4AF37]/45 text-black bg-gradient-to-r from-[#BFA06D] to-[#D4AF37] font-semibold uppercase tracking-widest text-sm text-center shadow-[0_0_24px_rgba(212,175,55,0.18)] hover:shadow-[0_0_36px_rgba(212,175,55,0.28)] transition"
              >
                Découvrir nos expertises
              </Link>

              <Link
                href="/portfolio"
                className="px-8 py-3 rounded-full border border-white/10 text-[#F9F1D8]/80 hover:text-[#F9F1D8] hover:border-[#D4AF37]/25 transition uppercase tracking-widest text-sm font-semibold text-center"
              >
                Voir nos travaux
              </Link>
            </div>

            <div className="mt-8 text-xs tracking-[0.28em] uppercase text-[#F9F1D8]/45">
              Dark Signature • Black & Gold • Premium delivery
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LINKS / PILLARS */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-serif text-3xl md:text-4xl text-[#D4AF37]">
          Expertises Signature.
        </h2>
        <p className="mt-2 text-[#F9F1D8]/55 max-w-2xl">
          Une structure claire, une exécution premium. Choisissez un pôle, on construit le reste autour.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { t: 'Cinématographie', d: 'Captation, aftermovie, narration.', href: '/services' },
            { t: "Photographie d’Art", d: 'Portraits, événements, studio.', href: '/services' },
            { t: 'Design & Branding', d: 'Identité, supports, direction.', href: '/services' },
            { t: 'Sonorisation', d: 'Clarté, impact, régie.', href: '/services' },
          ].map((c) => (
            <Link
              key={c.t}
              href={c.href}
              className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-[#D4AF37]/30 transition"
            >
              <div className="text-[#F9F1D8] font-serif text-xl">{c.t}</div>
              <div className="mt-2 text-sm text-[#F9F1D8]/55">{c.d}</div>
              <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent opacity-60 group-hover:opacity-100 transition" />
            </Link>
          ))}
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-[#D4AF37]">
              Nos travaux.
            </h2>
            <p className="mt-2 text-[#F9F1D8]/55">
              Une sélection — pensée comme une exposition privée.
            </p>
          </div>

          <Link
            href="/portfolio"
            className="hidden sm:inline-flex px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-[#F9F1D8]/80 hover:text-[#F9F1D8] hover:border-[#D4AF37]/25 transition uppercase tracking-widest text-xs font-semibold"
          >
            Ouvrir la galerie
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            '/media/portfolio/dinner-event.png',
            '/media/portfolio/graduation-group.png',
            '/media/portfolio/two-ladies-portrait.png',
            '/media/sound/sound-console-live.jpg',
            '/media/portfolio/photo-16.png',
            '/media/portfolio/photo-20.png',
            '/media/portfolio/design/disign-1.png',
            '/media/portfolio/design/disign-2.png',
          ].map((src) => (
            <div
              key={src}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-zinc-950/40"
            >
              <Image src={src} alt="" fill className="object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </section>

      {/* CONSULTATION CTA */}
      <section id="consultation" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10 shadow-[0_40px_140px_-120px_rgba(212,175,55,0.25)]">
          <h3 className="font-serif text-3xl md:text-5xl leading-tight">
            Prêt à rehausser votre prochain événement ?
          </h3>

          <p className="mt-3 text-[#F9F1D8]/60 max-w-2xl">
            Brief cadré, exécution premium, livraison propre. Contact direct via WhatsApp — concierge disponible.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3 rounded-full border border-[#D4AF37]/45 text-black bg-gradient-to-r from-[#BFA06D] to-[#D4AF37] font-semibold uppercase tracking-widest text-sm text-center"
            >
              Book a Consultation (WhatsApp)
            </a>

            <Link
              href="/contact"
              className="px-8 py-3 rounded-full border border-white/10 text-[#F9F1D8]/80 hover:text-[#F9F1D8] hover:border-[#D4AF37]/25 transition uppercase tracking-widest text-sm font-semibold text-center"
            >
              Page Contact
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}