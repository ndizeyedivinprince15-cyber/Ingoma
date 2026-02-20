'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

type Category = 'All' | 'Photography' | 'Video' | 'Design' | 'Sound';

type Project = {
  id: number;
  title: string;
  category: Exclude<Category, 'All'>;
  size: 'small' | 'medium' | 'large';
  imageSrc: string;
};

export default function PortfolioGrid() {
  const searchParams = useSearchParams();

  const categories: Category[] = ['All', 'Photography', 'Video', 'Design', 'Sound'];
  const [filter, setFilter] = useState<Category>('All');

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (!cat) return;
    if (categories.includes(cat as Category)) setFilter(cat as Category);
  }, [searchParams]);

  const projects: Project[] = useMemo(
    () => [
      // -------------------------
      // PHOTOGRAPHY (4 large / 6 medium / reste small)
      // -------------------------
      { id: 101, title: 'Gala Dinner', category: 'Photography', size: 'large', imageSrc: '/media/portfolio/dinner-event.png' },
      { id: 102, title: 'Graduation Group', category: 'Photography', size: 'large', imageSrc: '/media/portfolio/graduation-group.png' },
      { id: 103, title: 'Photo 16 (Hero)', category: 'Photography', size: 'large', imageSrc: '/media/portfolio/photo-16.png' },
      { id: 104, title: 'Photo 20 (Hero)', category: 'Photography', size: 'large', imageSrc: '/media/portfolio/photo-20.png' },

      { id: 105, title: 'Two Ladies Portrait', category: 'Photography', size: 'medium', imageSrc: '/media/portfolio/two-ladies-portrait.png' },
      { id: 106, title: 'Photo 07', category: 'Photography', size: 'medium', imageSrc: '/media/portfolio/photo-7.jpg' },
      { id: 107, title: 'Photo 15', category: 'Photography', size: 'medium', imageSrc: '/media/portfolio/photo-15.png' },
      { id: 108, title: 'Photo 19', category: 'Photography', size: 'medium', imageSrc: '/media/portfolio/photo-19.png' },
      { id: 109, title: 'Photo 10', category: 'Photography', size: 'medium', imageSrc: '/media/portfolio/photo-10.jpg' },
      { id: 110, title: 'Photo 13', category: 'Photography', size: 'medium', imageSrc: '/media/portfolio/photo-13.jpg' },

      { id: 111, title: 'Gold Detail', category: 'Photography', size: 'small', imageSrc: '/media/portfolio/gold-detail.png' },
      { id: 112, title: 'Photo 02', category: 'Photography', size: 'small', imageSrc: '/media/portfolio/photo-2.jpg' },
      { id: 113, title: 'Photo 03', category: 'Photography', size: 'small', imageSrc: '/media/portfolio/photo-3.jpg' },
      { id: 114, title: 'Photo 04', category: 'Photography', size: 'small', imageSrc: '/media/portfolio/photo-4.jpg' },
      { id: 115, title: 'Photo 05', category: 'Photography', size: 'small', imageSrc: '/media/portfolio/photo-5.jpg' },
      { id: 116, title: 'Photo 06', category: 'Photography', size: 'small', imageSrc: '/media/portfolio/photo-6.jpg' },
      { id: 117, title: 'Photo 08', category: 'Photography', size: 'small', imageSrc: '/media/portfolio/photo-8.jpg' },
      { id: 118, title: 'Photo 09', category: 'Photography', size: 'small', imageSrc: '/media/portfolio/photo-9.jpg' },
      { id: 119, title: 'Photo 11', category: 'Photography', size: 'small', imageSrc: '/media/portfolio/photo-11.jpg' },
      { id: 120, title: 'Photo 12', category: 'Photography', size: 'small', imageSrc: '/media/portfolio/photo-12.jpg' },
      { id: 121, title: 'Photo 14', category: 'Photography', size: 'small', imageSrc: '/media/portfolio/photo-14.jpg' },
      { id: 122, title: 'Photo 17', category: 'Photography', size: 'small', imageSrc: '/media/portfolio/photo-17.jpg' },
      { id: 123, title: 'Photo 18', category: 'Photography', size: 'small', imageSrc: '/media/portfolio/photo-18.jpg' },

      // -------------------------
      // VIDEO
      // -------------------------
      { id: 401, title: 'Video 06 (Hero)', category: 'Video', size: 'large', imageSrc: '/media/portfolio/video/video-6.png' },
      { id: 402, title: 'Video 05 (Hero)', category: 'Video', size: 'large', imageSrc: '/media/portfolio/video/video-5.jpg' },
      { id: 403, title: 'Video 01', category: 'Video', size: 'medium', imageSrc: '/media/portfolio/video/video-1.jpg' },
      { id: 404, title: 'Video 04', category: 'Video', size: 'medium', imageSrc: '/media/portfolio/video/video-4.jpg' },
      { id: 405, title: 'Video 02', category: 'Video', size: 'small', imageSrc: '/media/portfolio/video/video-2.jpg' },
      { id: 406, title: 'Video 03', category: 'Video', size: 'small', imageSrc: '/media/portfolio/video/video-3.jpg' },

      // -------------------------
      // DESIGN
      // -------------------------
      { id: 501, title: 'Design 01', category: 'Design', size: 'large', imageSrc: '/media/portfolio/design/disign-1.png' },
      { id: 502, title: 'Design 02', category: 'Design', size: 'medium', imageSrc: '/media/portfolio/design/disign-2.png' },
      { id: 503, title: 'Design 03', category: 'Design', size: 'medium', imageSrc: '/media/portfolio/design/disign-3.png' },

      // -------------------------
      // SOUND
      // -------------------------
      { id: 301, title: 'Console Live', category: 'Sound', size: 'large', imageSrc: '/media/sound/sound-console-live.jpg' },
      { id: 302, title: 'Headset & Mixer', category: 'Sound', size: 'medium', imageSrc: '/media/sound/sound-headset-mixer.jpg' },
      { id: 303, title: 'Podcast Room', category: 'Sound', size: 'large', imageSrc: '/media/sound/sound-podcast-room.jpg' },
      { id: 304, title: 'Table Setup', category: 'Sound', size: 'medium', imageSrc: '/media/sound/sound-table-setup.jpg' },
      { id: 305, title: 'Micro Close-up', category: 'Sound', size: 'small', imageSrc: '/media/sound/sound-mic-close.jpg' },
      { id: 306, title: 'Microphones', category: 'Sound', size: 'small', imageSrc: '/media/sound/sound-mics.jpg' },
      { id: 307, title: 'PA Kit', category: 'Sound', size: 'small', imageSrc: '/media/sound/sound-pa-kit.jpg' },
      { id: 308, title: 'Speakers Kit', category: 'Sound', size: 'small', imageSrc: '/media/sound/sound-speakers-kit.jpg' },
    ],
    []
  );

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  const sizeClass = (size: Project['size']) => {
    if (size === 'large') return 'md:col-span-2 md:row-span-2';
    if (size === 'medium') return 'md:row-span-2';
    return '';
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => {
          const active = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={
                'px-5 py-2 rounded-full text-sm border backdrop-blur-xl transition-all duration-300 ' +
                (active
                  ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_18px_rgba(212,175,55,0.30)]'
                  : 'bg-white/5 text-[#F9F1D8]/70 border-white/10 hover:border-[#D4AF37]/45 hover:text-[#F9F1D8]')
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[210px] md:auto-rows-[230px]">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.article
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={'group relative ' + sizeClass(p.size)}
            >
              <div className="relative h-full w-full rounded-2xl p-[1px] bg-[linear-gradient(120deg,rgba(212,175,55,0.18),rgba(255,255,255,0.05),rgba(212,175,55,0.12))] transition duration-300 group-hover:shadow-[0_0_0_1px_rgba(212,175,55,0.22),0_0_55px_rgba(212,175,55,0.14)]">
                <div className="relative h-full w-full rounded-2xl overflow-hidden bg-zinc-950/60">
                  <img
                    src={p.imageSrc}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-80" />
                  <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-20 group-hover:opacity-70 transition duration-300" />

                  <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-[#D4AF37] text-xs uppercase tracking-widest mb-2">{p.category}</span>
                    <h3 className="font-serif text-2xl text-white drop-shadow">{p.title}</h3>
                    <div className="w-12 h-[2px] bg-[#D4AF37] mt-4" />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
