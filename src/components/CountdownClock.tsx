'use client';

import { useEffect, useState } from 'react';

export default function CountdownClock() {
  const [timeLeft, setTimeLeft] = useState<{ hrs: string; mins: string; secs: string }>({
    hrs: '00',
    mins: '00',
    secs: '00'
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      // Get current date in GMT
      const nowGMT = new Date(now.toLocaleString('en-US', { timeZone: 'GMT' }));
      
      const target = new Date(nowGMT);
      // Day of week (0 is Sunday, 1 is Monday, etc.)
      const dayOfWeek = target.getDay();
      
      // Calculate days until next Monday. 
      // If today is Monday (1) and before 12:00, target is today.
      // Else, target is next Monday.
      let daysUntilMonday = (1 - dayOfWeek + 7) % 7;
      if (daysUntilMonday === 0 && target.getHours() >= 12) {
        daysUntilMonday = 7;
      }
      
      target.setDate(target.getDate() + daysUntilMonday);
      target.setHours(12, 0, 0, 0); // 12:00 GMT
      
      const diffMs = target.getTime() - nowGMT.getTime();
      
      if (diffMs <= 0) return { hrs: '00', mins: '00', secs: '00' };

      const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

      return {
        hrs: totalHours.toString().padStart(2, '0'),
        mins: mins.toString().padStart(2, '0'),
        secs: secs.toString().padStart(2, '0')
      };
    };

    setTimeLeft(calculateTimeLeft()); // Initial set
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    // Return placeholder to prevent hydration mismatch
    return (
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <span className="font-headline text-5xl md:text-6xl font-black text-primary text-glow-primary">--</span>
          <span className="font-label text-[8px] text-on-surface-variant font-bold tracking-widest uppercase mt-1">HRS</span>
        </div>
        <span className="font-headline text-4xl font-black text-outline-variant">:</span>
        <div className="flex flex-col items-center">
          <span className="font-headline text-5xl md:text-6xl font-black text-primary text-glow-primary">--</span>
          <span className="font-label text-[8px] text-on-surface-variant font-bold tracking-widest uppercase mt-1">MIN</span>
        </div>
        <span className="font-headline text-4xl font-black text-outline-variant">:</span>
        <div className="flex flex-col items-center">
          <span className="font-headline text-5xl md:text-6xl font-black text-primary text-glow-primary">--</span>
          <span className="font-label text-[8px] text-on-surface-variant font-bold tracking-widest uppercase mt-1">SEC</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center">
        <span className="font-headline text-5xl md:text-6xl font-black text-primary text-glow-primary">{timeLeft.hrs}</span>
        <span className="font-label text-[8px] text-on-surface-variant font-bold tracking-widest uppercase mt-1">HRS</span>
      </div>
      <span className="font-headline text-4xl font-black text-outline-variant">:</span>
      <div className="flex flex-col items-center">
        <span className="font-headline text-5xl md:text-6xl font-black text-primary text-glow-primary">{timeLeft.mins}</span>
        <span className="font-label text-[8px] text-on-surface-variant font-bold tracking-widest uppercase mt-1">MIN</span>
      </div>
      <span className="font-headline text-4xl font-black text-outline-variant">:</span>
      <div className="flex flex-col items-center">
        <span className="font-headline text-5xl md:text-6xl font-black text-primary text-glow-primary">{timeLeft.secs}</span>
        <span className="font-label text-[8px] text-on-surface-variant font-bold tracking-widest uppercase mt-1">SEC</span>
      </div>
    </div>
  );
}
