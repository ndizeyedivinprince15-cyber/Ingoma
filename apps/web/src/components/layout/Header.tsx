'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';

type NavItem = { label: string; href: string };

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = useMemo<NavItem[]>(
    () => [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Nos travaux', href: '/portfolio' },
      { label: 'À propos', href: '/about' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ],
    []
  );

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-4">
        <div className="flex items-center justify-between gap-4">
          {/* ✅ LOGO HORS DE LA CAPSULE */}
          <Link href="/" className="relative flex items-center">
            {/* glow */}
            <span className="absolute -inset-4 rounded-3xl bg-[#D4AF37]/10 blur-2xl" />
            <Image
              src="/media/brand/ingoma-logo.png"
              alt="Ingoma Creative Hub"
              width={260}
              height={80}
              priority
              className="relative h-12 md:h-14 w-auto brightness-110 contrast-110 drop-shadow-[0_10px_28px_rgba(0,0,0,0.7)]"
            />
          </Link>

          {/* ✅ CAPSULE MENU */}
          <div className="flex items-center justify-end flex-1">
            <div className="w-auto rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl shadow-[0_20px_80px_-60px_rgba(212,175,55,0.25)]">
              <div className="flex items-center justify-between px-3 py-3">
                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-2">
                  {nav.map((item) => {
                    const active =
                      item.href === '/'
                        ? pathname === '/'
                        : pathname?.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={
                          'px-4 py-2 rounded-full text-sm border transition ' +
                          (active
                            ? 'text-black bg-[#D4AF37] border-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.25)]'
                            : 'text-[#F9F1D8]/70 border-white/10 bg-white/5 hover:border-[#D4AF37]/40 hover:text-[#F9F1D8]')
                        }
                      >
                        {item.label}
                      </Link>
                    );
                  })}

                  {/* CTA */}
                  <Link
                    href="/#consultation"
                    className="ml-2 px-4 py-2 rounded-full text-sm font-semibold border border-[#D4AF37]/30 bg-gradient-to-r from-[#BFA06D] to-[#806815] text-black shadow-[0_0_22px_rgba(212,175,55,0.22)] hover:shadow-[0_0_35px_rgba(212,175,55,0.35)] transition"
                  >
                    Book a Consultation
                  </Link>
                </nav>

                {/* Mobile menu button */}
                <button
                  className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-[#F9F1D8]/80"
                  onClick={() => setOpen((v) => !v)}
                  aria-label="Open menu"
                >
                  {open ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>

              {/* line */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent opacity-40" />

              {/* Mobile dropdown */}
              {open && (
                <div className="md:hidden px-3 pb-4">
                  <div className="flex flex-col gap-2 pt-3">
                    {nav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-[#F9F1D8]/80 hover:border-[#D4AF37]/40 transition"
                      >
                        {item.label}
                      </Link>
                    ))}

                    <Link
                      href="/#consultation"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-xl border border-[#D4AF37]/30 bg-gradient-to-r from-[#BFA06D] to-[#806815] text-black font-semibold"
                    >
                      Book a Consultation
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}