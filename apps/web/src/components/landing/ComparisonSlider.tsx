'use client';
import { useState, useRef, useEffect } from 'react';
import { MoveHorizontal } from 'lucide-react';

export default function ComparisonSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, position)));
  };

  const onMouseDown = () => setIsDragging(true);
  const onMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging) { // @ts-ignore 
        handleMove(e); 
      }
    };
    const handleGlobalUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleGlobalMove);
    window.addEventListener('touchmove', handleGlobalMove);
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('touchend', handleGlobalUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/5] md:aspect-[16/9] rounded-3xl overflow-hidden cursor-col-resize select-none border border-[#D4AF37]/30 shadow-[0_0_50px_-10px_rgba(212,175,55,0.15)] group"
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
    >
      {/* IMAGE APRES (apres.png) */}
      <img
        src="/media/apres.png"
        alt="Edited"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute top-6 right-6 bg-[#050505]/80 backdrop-blur-md px-4 py-1 rounded-sm text-xs font-serif tracking-widest text-[#D4AF37] border border-[#D4AF37]/30">
        EDITED
      </div>

      {/* IMAGE AVANT (avant.png) */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src="/media/avant.png"
          alt="Raw"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-90"
        />
        <div className="absolute top-6 left-6 bg-[#050505]/80 backdrop-blur-md px-4 py-1 rounded-sm text-xs font-serif tracking-widest text-[#F9F1D8] border border-[#F9F1D8]/20">
          RAW
        </div>
      </div>

      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-[#D4AF37] cursor-col-resize z-20 shadow-[0_0_20px_rgba(212,175,55,0.8)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[#050505] border border-[#D4AF37] rounded-full flex items-center justify-center shadow-2xl text-[#D4AF37]">
          <MoveHorizontal size={24} />
        </div>
      </div>
    </div>
  );
}