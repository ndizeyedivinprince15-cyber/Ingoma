'use client';

import { Music, Video } from 'lucide-react';

export default function ServicesPricing() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 -mt-10 md:-mt-20 relative z-10 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PHOTOGRAPHY */}
        <div className="relative h-[350px] rounded-3xl border border-[#D4AF37]/10 bg-[#0A0A0A]/80 backdrop-blur-xl p-2 flex flex-col items-center justify-end overflow-hidden group hover:border-[#D4AF37]/30 transition-colors">
          <div className="absolute top-6 left-6 right-6 h-[220px] rounded-xl overflow-hidden border border-[#D4AF37]/10">
            <img
              src="/media/avant.png"
              alt="Photography"
              className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition duration-700"
            />
          </div>

          <div className="relative z-10 pb-8 text-center">
            <h3 className="text-[#F9F1D8] font-serif text-lg tracking-wide">
              Photography
            </h3>
            <div className="w-1 h-8 bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent mx-auto mt-2 opacity-50" />
          </div>
        </div>

        {/* MIDDLE COLUMN */}
        <div className="flex flex-col gap-6 h-[350px]">
          {/* SOUND (comme avant : fond branding + icône Music) */}
          <div className="flex-1 rounded-3xl border border-[#D4AF37]/10 bg-[#0A0A0A]/80 backdrop-blur-xl flex items-center justify-center relative group overflow-hidden hover:border-[#D4AF37]/30 transition-colors">
            <img
              src="/media/branding.png"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition duration-500"
              alt="Branding"
            />

            <div className="relative z-10 w-24 h-24 rounded-full border border-[#D4AF37]/30 flex items-center justify-center backdrop-blur-sm bg-black/20">
              <Music className="text-[#D4AF37] w-8 h-8" />
            </div>
          </div>

          <div className="h-24 rounded-3xl border border-[#D4AF37]/10 bg-gradient-to-r from-[#806815]/10 to-transparent flex items-center justify-center">
            <span className="text-[#EAD6A6]/80 font-serif tracking-widest text-sm uppercase">
              Sound & Branding
            </span>
          </div>
        </div>

        {/* VIDEO */}
        <div className="relative h-[350px] rounded-3xl border border-[#D4AF37]/10 bg-[#0A0A0A]/80 backdrop-blur-xl p-2 flex flex-col items-center justify-center overflow-hidden group hover:border-[#D4AF37]/30 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          <img
            src="/media/video.png"
            alt="Video"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition duration-700"
          />

          <div className="relative z-20 mt-32 text-center">
            <div className="inline-block p-4 rounded-full bg-black/50 backdrop-blur-md border border-[#D4AF37]/20 mb-4">
              <Video className="text-[#D4AF37] w-6 h-6" />
            </div>
            <h3 className="text-[#F9F1D8] font-serif text-lg tracking-wide">
              Video Service
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}