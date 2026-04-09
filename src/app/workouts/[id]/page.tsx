import mongoose from 'mongoose';
import Workout from '@/models/Workout';
import { notFound } from 'next/navigation';

export default async function WorkoutDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Connect to DB wrapper
  if (mongoose.connection.readyState !== 1 && process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  let workout = null;
  try {
    workout = await Workout.findById(id).lean();
  } catch (e) {
    console.error("DB Error", e);
  }

  if (!workout) {
    notFound();
  }

  return (
    <main className="pt-20 pb-32">
      {/* Hero Workout Media */}
      <section className="relative w-full aspect-[4/5] md:aspect-video overflow-hidden">
        <img
          className="w-full h-full object-cover brightness-75"
          alt={workout.title}
          src={workout.mediaUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDD13YXbmZG1QObLhhQc0wC3Zqn3RXfjmrFD0YSryHx9sx7D4LdKqXmKQ7oWofs698JOeDfxA9hrp7X_Hfn5wLgitwDQHlFb4fmb8u-i9AEc6OxxdPT4kHQ1EeO7hNODp2RNNVJLL-dZGGwcH22gXinpUEnOXYf8CXYe5aX0FRMr9AII9ZbAu11rCGQZryExZMZThk8WeWNTI3nR_91qHkU8npo5bYb7G7seDm9tcI4tvh0u7SWfUOnmyJAzkk0jiUWfWb5yWwbAiM"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        
        {/* Play Overlay */}
        {workout.mediaType === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-20 h-20 rounded-full glass-card flex items-center justify-center border border-white/10 group scale-95 active:scale-90 transition-transform">
              <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            </button>
          </div>
        )}

        {/* Stats Overlay (Glassmorphism) */}
        <div className="absolute bottom-8 left-6 right-6 flex justify-between items-end">
          <div className="flex flex-col">
            <span className="font-headline font-black text-4xl md:text-6xl text-on-surface uppercase tracking-tighter leading-none whitespace-pre-wrap">
              {workout.title.replace(' ', '\n')}
            </span>
            <span className="text-on-surface-variant font-label text-sm mt-2 tracking-widest uppercase">
              Target: {workout.categories?.[0] || 'Full Body'}
            </span>
          </div>
        </div>
      </section>

      {/* Metrics Bento Grid */}
      <section className="px-6 -mt-10 relative z-10 grid grid-cols-3 gap-3">
        <div className="bg-surface-container-high p-5 rounded-xl flex flex-col items-center justify-center border-b-2 border-primary/20">
          <span className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest mb-1">Sets</span>
          <span className="font-headline font-black text-3xl text-primary">04</span>
        </div>
        <div className="bg-surface-container-high p-5 rounded-xl flex flex-col items-center justify-center border-b-2 border-primary/20">
          <span className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest mb-1">Reps</span>
          <span className="font-headline font-black text-3xl text-primary">12</span>
        </div>
        <div className="bg-surface-container-high p-5 rounded-xl flex flex-col items-center justify-center border-b-2 border-primary/20">
          <span className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest mb-1">Rest</span>
          <span className="font-headline font-black text-3xl text-primary">60<span className="text-sm">s</span></span>
        </div>
      </section>

      {/* Instructions Section */}
      <section className="mt-12 px-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline font-bold text-xl uppercase tracking-tight">Detailed Instructions</h3>
          <span className="h-[2px] flex-grow ml-4 bg-outline-variant/30"></span>
        </div>
        
        <div className="space-y-8">
          <div className="flex gap-6">
            <span className="font-headline font-black text-4xl text-surface-container-highest leading-none">01</span>
            <div>
              <h4 className="font-bold text-on-surface text-lg mb-2">Set the Foundation</h4>
              <p className="text-on-surface-variant leading-relaxed font-body">Focus heavily on stable foot placement and engaged core to maximize stability.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <span className="font-headline font-black text-4xl text-surface-container-highest leading-none">02</span>
            <div>
              <h4 className="font-bold text-on-surface text-lg mb-2">The Drive Phase</h4>
              <p className="text-on-surface-variant leading-relaxed font-body">{workout.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trainer's Notes Card */}
      <section className="mt-12 px-6">
        <div className="relative bg-surface-container-low rounded-[32px] p-8 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-tertiary/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-tertiary">format_quote</span>
              <span className="font-headline font-black text-xs uppercase tracking-[0.2em] text-tertiary">Trainer's Elite Insight</span>
            </div>
            <p className="text-on-surface italic text-lg leading-relaxed font-medium">
              "Focus on the stretch at the bottom of the movement. Don't ego lift—control is king."
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-tertiary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <span className="text-on-tertiary-container font-label text-xs font-bold tracking-widest uppercase">Coach Marcus / Elite S&amp;C</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Action */}
      <div className="fixed bottom-24 left-0 w-full px-6 z-40 pointer-events-none">
        <button className="pointer-events-auto w-full bg-gradient-to-r from-primary-container to-primary text-on-primary-fixed font-headline font-black py-5 rounded-full uppercase tracking-[0.2em] shadow-[0_10px_40px_rgba(202,253,0,0.3)] scale-100 active:scale-95 transition-transform flex items-center justify-center gap-3">
          START SET
          <span className="material-symbols-outlined font-normal">bolt</span>
        </button>
      </div>
    </main>
  );
}
