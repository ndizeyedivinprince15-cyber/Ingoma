import Link from 'next/link';

const API = 'https://ingoma-api-bu2a.vercel.app/api';

type PortfolioItem = {
  id: string;
  mediaUrl: string;
  mediaType: string;
  title: string;
};

type Creative = {
  id: string;
  name: string;
  slug: string;
  domain: string;
  bio: string | null;
  location: string;
  phone: string | null;
  email: string | null;
  isVerified: boolean;
  portfolio: PortfolioItem[];
};

async function getCreatives(domain?: string): Promise<Creative[]> {
  try {
    const url = domain ? `${API}/creatives?domain=${domain}` : `${API}/creatives`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const DOMAINS = ['Tous', 'photographie', 'design', 'guide', 'musique', 'vidéographie', 'sonorisation'];

function CreativeSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 animate-pulse">
      <div className="aspect-[4/3] rounded-2xl bg-white/10 mb-4" />
      <div className="h-5 bg-white/10 rounded-full w-2/3 mb-2" />
      <div className="h-3 bg-white/10 rounded-full w-1/3 mb-3" />
      <div className="h-3 bg-white/10 rounded-full w-full mb-1" />
      <div className="h-3 bg-white/10 rounded-full w-4/5" />
    </div>
  );
}

export default async function CreativesPage({
  searchParams,
}: {
  searchParams: { domain?: string };
}) {
  const activeDomain = searchParams.domain;
  const creatives = await getCreatives(activeDomain);

  return (
    <main className="bg-[#050505] text-[#F9F1D8] min-h-screen">
      {/* Gold glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#D4AF37]/8 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-[#D4AF37]/60 mb-3">
            Talents · Gitega
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-[#D4AF37] leading-tight">
            Nos Créatifs.
          </h1>
          <p className="mt-3 text-[#F9F1D8]/55 max-w-xl text-base">
            Photographes, designers, guides et artistes — une sélection rigoureuse de talents basés à Gitega.
          </p>
        </div>

        {/* Domain filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {DOMAINS.map((d) => {
            const value = d === 'Tous' ? undefined : d;
            const isActive = (!activeDomain && d === 'Tous') || activeDomain === d;
            return (
              <Link
                key={d}
                href={value ? `/creatives?domain=${value}` : '/creatives'}
                className={
                  'px-4 py-2 rounded-full text-sm border transition uppercase tracking-widest ' +
                  (isActive
                    ? 'text-black bg-[#D4AF37] border-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.25)]'
                    : 'text-[#F9F1D8]/70 border-white/10 bg-white/5 hover:border-[#D4AF37]/40 hover:text-[#F9F1D8]')
                }
              >
                {d}
              </Link>
            );
          })}
        </div>

        {/* Grid */}
        {creatives.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Empty state with skeletons for loading feel */}
            <div className="col-span-full text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-white/10 bg-white/5 mb-4">
                <span className="text-2xl">✦</span>
              </div>
              <p className="font-serif text-xl text-[#D4AF37]">Aucun créatif pour l'instant.</p>
              <p className="mt-2 text-[#F9F1D8]/45 text-sm">
                Les profils seront ajoutés très prochainement.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {creatives.map((creative) => (
              <div
                key={creative.id}
                className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden hover:border-[#D4AF37]/30 transition"
              >
                {/* Portfolio preview */}
                <div className="relative aspect-[4/3] bg-zinc-950/60 overflow-hidden">
                  {creative.portfolio[0] ? (
                    <img
                      src={creative.portfolio[0].mediaUrl}
                      alt={creative.portfolio[0].title}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-[1.03] transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[#D4AF37]/20 text-5xl font-serif">
                        {creative.name[0]}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  {/* Domain badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[#D4AF37] text-xs uppercase tracking-widest backdrop-blur-sm">
                      {creative.domain}
                    </span>
                  </div>
                  {creative.isVerified && (
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs">
                        ✓ Vérifié
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-serif text-xl text-[#F9F1D8]">{creative.name}</h3>
                  <p className="text-xs text-[#D4AF37]/70 uppercase tracking-widest mt-1">
                    {creative.location}
                  </p>
                  {creative.bio && (
                    <p className="mt-3 text-sm text-[#F9F1D8]/55 line-clamp-2">{creative.bio}</p>
                  )}

                  {/* Portfolio count */}
                  {creative.portfolio.length > 1 && (
                    <p className="mt-3 text-xs text-[#F9F1D8]/35">
                      +{creative.portfolio.length} œuvres
                    </p>
                  )}

                  {/* Contact */}
                  <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent" />
                  <div className="mt-4 flex gap-2">
                    {creative.phone && (
                      <a
                        href={`https://wa.me/${creative.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 px-3 py-2 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-xs text-center uppercase tracking-widest hover:bg-[#D4AF37]/20 transition"
                      >
                        WhatsApp
                      </a>
                    )}
                    {creative.email && (
                      <a
                        href={`mailto:${creative.email}`}
                        className="flex-1 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-[#F9F1D8]/70 text-xs text-center uppercase tracking-widest hover:border-[#D4AF37]/25 hover:text-[#F9F1D8] transition"
                      >
                        Email
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
