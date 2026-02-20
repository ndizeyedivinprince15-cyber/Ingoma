'use client';

import { motion } from 'framer-motion';

export default function OrbBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-black" />

      <motion.div
        className="absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl opacity-35"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(34,211,238,0.45), transparent 60%)',
        }}
        animate={{ x: [0, 40, -20, 0], y: [0, 20, 50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-24 right-[-120px] h-[520px] w-[520px] rounded-full blur-3xl opacity-30"
        style={{
          background:
            'radial-gradient(circle at 40% 35%, rgba(147,51,234,0.45), transparent 62%)',
        }}
        animate={{ x: [0, -50, 10, 0], y: [0, 30, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-160px] left-1/3 h-[520px] w-[520px] rounded-full blur-3xl opacity-20"
        style={{
          background:
            'radial-gradient(circle at 40% 40%, rgba(34,211,238,0.35), transparent 65%)',
        }}
        animate={{ x: [0, 30, -30, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.65)_100%)]" />
    </div>
  );
}