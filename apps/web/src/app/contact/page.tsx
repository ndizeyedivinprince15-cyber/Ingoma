'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';

const SERVICES = [
  'Cinématographie',
  "Photographie d’Art & Studio",
  'Branding & Design',
  'Audio & Son',
  'Copywriting',
] as const;

const BUDGETS = [
  'Moins de 500k FBU',
  '500k - 2M FBU',
  '2M - 5M FBU',
  "Projet d'envergure (+5M)",
] as const;

export default function ContactPage() {
  const whatsappNumber = '25769034965'; 

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [message, setMessage] = useState('');

 const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

  
    const text =
      `Bonjour, je souhaite démarrer un projet.\n\n` +
      `Nom: ${fullName || '-'}\n` +
      `Email: ${email || '-'}\n` +
      `Service: ${selectedService || '-'}\n` +
      `Budget: ${budget || '-'}\n\n` +
      `Message:\n${message || '-'}`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F9F1D8]/70 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-[#D4AF37]/7 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[520px] h-[520px] bg-[#D4AF37]/7 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-start">
          {/* LEFT: INFO */}
          <div className="flex flex-col justify-center">
            <h1 className="font-serif text-5xl md:text-7xl text-[#D4AF37] mb-8 tracking-tight">
              Start the <br /> Conversation.
            </h1>

            <p className="text-lg md:text-xl text-[#F9F1D8]/45 mb-12 font-light leading-relaxed max-w-md">
              Prêt à donner vie à votre vision ? Parlons de votre prochain projet
              Signature à Gitega.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex items-center gap-6 group">
                <div className="p-4 bg-zinc-900/50 rounded-2xl border border-white/10 group-hover:border-[#D4AF37]/40 transition-colors">
                  <Phone className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-xs text-[#F9F1D8]/35 uppercase tracking-[0.25em]">
                    Appelez-nous
                  </p>
                  <p className="text-lg text-[#F9F1D8] font-medium">
                    +257 61 22 35 36
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="p-4 bg-zinc-900/50 rounded-2xl border border-white/10 group-hover:border-[#D4AF37]/40 transition-colors">
                  <Mail className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-xs text-[#F9F1D8]/35 uppercase tracking-[0.25em]">
                    Email
                  </p>
                  <p className="text-lg text-[#F9F1D8] font-medium">
                    ndizeyedivinprince15@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="p-4 bg-zinc-900/50 rounded-2xl border border-white/10 group-hover:border-[#D4AF37]/40 transition-colors">
                  <MapPin className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-xs text-[#F9F1D8]/35 uppercase tracking-[0.25em]">
                    Localisation
                  </p>
                  <p className="text-lg text-[#F9F1D8] font-medium">
                    Gitega, Burundi
                  </p>
                </div>
              </div>
            </div>

            {/*  */}
            <div className="flex gap-4">
              {[
                { Icon: Instagram, href: '#' },
                { Icon: Facebook, href: '#' },
                { Icon: Linkedin, href: '#' },
              ].map(({ Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-zinc-900/40 border border-white/10 rounded-full hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div className="bg-zinc-900/35 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-[#F9F1D8]/100 ml-1">
                    Nom complet
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    type="text"
                    placeholder="Ex: Divin Prince NDIZEYE"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/15 transition-all placeholder:text-[#F9F1D8]/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-[#F9F1D8]/100 ml-1">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="ndizeyedivinprince15@gmail.com"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/15 transition-all placeholder:text-[#F9F1D8]/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-[#F9F1D8]/100 ml-1">
                  Service souhaité
                </label>

               <div className="grid grid-cols-2 gap-3">
  {SERVICES.map((service, idx) => {
    const isLastOdd = SERVICES.length % 2 === 1 && idx === SERVICES.length - 1;

    return (
      <button
        key={service}
        type="button"
        onClick={() => setSelectedService(service)}
        className={
          'py-3.5 px-4 rounded-xl border text-sm transition-all duration-300 backdrop-blur-md text-center ' +
          (isLastOdd ? 'col-span-2 mx-auto w-full max-w-[420px]' : '') +
          (selectedService === service
            ? ' border-[#D4AF37]/80 bg-[#D4AF37]/12 text-[#D4AF37] shadow-[0_0_0_1px_rgba(212,175,55,0.20),0_0_22px_rgba(212,175,55,0.12)]'
            : ' border-white/15 bg-white/5 text-[#F9F1D8]/75 hover:border-[#D4AF37]/45 hover:bg-white/8 hover:text-[#F9F1D8]')
        }
      >
        {service}
      </button>
    );
  })}
</div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-[#F9F1D8]/100 ml-1">
                  Budget estimé
                </label>

                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-[#D4AF37]/60 transition-all appearance-none cursor-pointer text-[#F9F1D8]/70"
                >
                  <option value="" disabled className="bg-black">
                    Sélectionnez une fourchette
                  </option>
                  {BUDGETS.map((opt) => (
                    <option key={opt} value={opt} className="bg-black">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-[#F9F1D8]/100 ml-1">
                  Votre message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Décrivez votre vision en quelques mots..."
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/15 transition-all placeholder:text-[#F9F1D8]/20"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-5 bg-gradient-to-r from-[#BFA06D] to-[#D4AF37] text-black font-bold rounded-xl flex items-center justify-center gap-3 shadow-[0_10px_30px_-10px_rgba(212,175,55,0.22)] hover:shadow-[0_0_45px_rgba(212,175,55,0.18)] transition-all duration-300"
              >
                ENVOYER SUR WHATSAPP
                <Send className="w-5 h-5" />
              </motion.button>

              <p className="text-xs text-[#F9F1D8]/35">
                En cliquant, un message WhatsApp pré-rempli s’ouvre (concierge).
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}