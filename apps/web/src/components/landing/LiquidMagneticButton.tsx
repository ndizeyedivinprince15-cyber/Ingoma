'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  newTab?: boolean;
};

export default function LiquidMagneticButton({
  href,
  children,
  className,
  newTab,
}: Props) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const hx = useMotionValue(50);
  const hy = useMotionValue(50);

  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.6 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.6 });

  return (
    <motion.div style={{ x, y }} className="inline-block">
      <motion.a
        ref={ref}
        href={href}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noreferrer' : undefined}
        onMouseMove={(e) => {
          if (!ref.current) return;
          const r = ref.current.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          mx.set(dx * 0.22);
          my.set(dy * 0.22);

          hx.set(((e.clientX - r.left) / r.width) * 100);
          hy.set(((e.clientY - r.top) / r.height) * 100);
        }}
        onMouseLeave={() => {
          mx.set(0);
          my.set(0);
          hx.set(50);
          hy.set(50);
        }}
        className={
          'group relative isolate inline-flex items-center justify-center rounded-2xl px-7 py-4 text-sm md:text-base font-semibold text-zinc-100 ' +
          'border border-white/10 bg-white/5 backdrop-blur-xl ' +
          'shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_28px_120px_-90px_rgba(34,211,238,0.60)] ' +
          'overflow-hidden ' +
          (className ?? '')
        }
      >
        <motion.span
          className="pointer-events-none absolute inset-0 -z-20 opacity-90"
          style={{
            background:
              'linear-gradient(90deg, rgba(34,211,238,0.35), rgba(147,51,234,0.35))',
            filter: 'blur(18px)',
          }}
          animate={{ x: ['-12%', '12%', '-12%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.span
          className="pointer-events-none absolute -z-10 h-40 w-40 rounded-full opacity-70 blur-2xl"
          style={{
            left: hx,
            top: hy,
            translateX: '-50%',
            translateY: '-50%',
            background:
              'radial-gradient(circle at 30% 30%, rgba(34,211,238,0.55), rgba(147,51,234,0.45) 55%, transparent 72%)',
          }}
        />

        <span className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_45%)] opacity-60" />

        <span className="relative">
          {children}
          <span className="block h-px w-0 group-hover:w-full bg-gradient-to-r from-cyan-400/60 to-purple-500/60 transition-all duration-300" />
        </span>
      </motion.a>
    </motion.div>
  );
}