import Image from 'next/image';
import { Instagram, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
        <div className="max-w-sm">
          <Image
            src="/media/brand/ingoma-logo.png"
            alt="Ingoma Creative Hub"
            width={190}
            height={54}
            className="h-10 w-auto"
          />
          <p className="mt-4 text-[#F9F1D8]/45 text-sm leading-relaxed">
            Agence multimédia premium. Photographie, vidéo, design et sonorisation — pour des événements à enjeux élevés.
          </p>
        </div>

        <div>
          <h4 className="text-[#D4AF37] font-serif tracking-widest text-sm uppercase mb-4">
            Follow
          </h4>
          <div className="flex gap-4">
            {[Instagram, Linkedin, Twitter].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#F9F1D8]/70 hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-white/5 text-xs text-[#F9F1D8]/35 flex justify-between">
        <span>© {new Date().getFullYear()} Ingoma Creative Hub</span>
        <span>All rights reserved.</span>
      </div>
    </footer>
  );
}