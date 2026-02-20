import './globals.css';
import type { Metadata } from 'next';

import Header from '@/components/layout/Header';
import Footer from '@/components/landing/Footer';
import PageTransition from '@/components/layout/PageTransition';

export const metadata: Metadata = {
  title: 'Ingoma Creative Hub',
  description: 'Architects of Atmosphere',
  icons: {
    icon: [{ url: '/media/brand/ingoma-mark.png' }],
    apple: [{ url: '/media/brand/ingoma-mark.png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-[#050505] text-[#F9F1D8] font-sans">
        <div className="min-h-screen flex flex-col">
          <Header />
          {/* espace pour le header fixed */}
          <div className="h-24" />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}