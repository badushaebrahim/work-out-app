'use client';

import { useEffect, useState } from 'react';

type ResetCycle = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

function getNextResetDate(cycle: ResetCycle): Date | null {
  const now = new Date();
  const next = new Date(now);

  switch (cycle) {
    case 'daily':
      next.setDate(now.getDate() + 1);
      next.setHours(0, 0, 0, 0);
      return next;
    case 'weekly':
      // Next Monday at midnight
      const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
      next.setDate(now.getDate() + daysUntilMonday);
      next.setHours(0, 0, 0, 0);
      return next;
    case 'monthly':
      // 1st of next month
      next.setMonth(now.getMonth() + 1, 1);
      next.setHours(0, 0, 0, 0);
      return next;
    case 'yearly':
      // Jan 1 of next year
      next.setFullYear(now.getFullYear() + 1, 0, 1);
      next.setHours(0, 0, 0, 0);
      return next;
    default:
      return null;
  }
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSecs = Math.floor(ms / 1000);
  const days = Math.floor(totalSecs / 86400);
  const hrs = Math.floor((totalSecs % 86400) / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  if (days > 0) {
    return `${days}d ${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m`;
  }
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function WorkoutResetCountdown({ resetCycle }: { resetCycle: ResetCycle }) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    if (resetCycle === 'never') return;

    const tick = () => {
      const target = getNextResetDate(resetCycle);
      if (!target) return;
      setTimeLeft(formatCountdown(target.getTime() - Date.now()));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [resetCycle]);

  if (resetCycle === 'never' || !timeLeft) return null;

  const cycleLabel: Record<ResetCycle, string> = {
    daily: 'Resets Tomorrow',
    weekly: 'Resets This Week',
    monthly: 'Resets This Month',
    yearly: 'Resets This Year',
    never: '',
  };

  return (
    <div className="flex items-center gap-1.5 mt-1.5 bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5 w-fit">
      <span className="material-symbols-outlined text-primary text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>
        timer
      </span>
      <span className="text-[9px] font-black uppercase tracking-widest text-primary">
        {cycleLabel[resetCycle]}: {timeLeft}
      </span>
    </div>
  );
}
