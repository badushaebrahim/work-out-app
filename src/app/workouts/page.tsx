import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import Workout from '@/models/Workout';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';

// Force dynamic fetch
export const dynamic = 'force-dynamic';

export default async function WorkoutsLibrary({
  searchParams,
}: {
  searchParams: Promise<{ focus?: string }>;
}) {
  const { focus } = await searchParams;
  const currentFocus = focus || 'All';

  // Check User Premium Status
  let isPremium = false;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;
    if (token) {
      const payload = await verifyJwt(token);
      if (payload && (payload.role === 'premium' || payload.role === 'admin')) {
        isPremium = true;
      }
    }
  } catch (e) {}

  // Connect to DB wrapper
  await connectToDatabase();

  // Fetch workouts to display
  let docs: any[] = [];
  try {
    docs = await Workout.find().lean() || [];
  } catch (e) {
    console.error("DB Error", e);
  }

  const filteredWorkouts = currentFocus === 'All'
    ? docs
    : docs.filter(w => w.categories && w.categories.map((c: string) => c.toUpperCase()).includes(currentFocus.toUpperCase()));

  return (
    <main className="pt-20 px-6 space-y-8 pb-24">
      {/* Workout Directory Headers */}
      <section className="space-y-4">
    <div className="flex justify-between items-end">
      <Link href="/" className="material-symbols-outlined text-[#f3ffca] active:scale-95 transition-transform text-3xl">arrow_back</Link>
    </div>
  </section>

  {/* Recommended Workouts based on selection */ }
  <section className="space-y-6">
    <div className="flex justify-between items-center border-b border-surface-container-high pb-4">
      <h2 className="font-headline text-xl font-black tracking-tighter uppercase text-white flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">bolt</span>
        {currentFocus} Sessions
      </h2>
    </div>

    {filteredWorkouts.length === 0 ? (
      <div className="bg-surface-container-low p-8 rounded-2xl text-center border border-white/5">
        <p className="text-on-surface-variant text-sm font-medium">No active sessions found for this zone.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWorkouts.map((workout: any) => {
          const isLocked = workout.tier === 'premium' && !isPremium;
          return (
            <Link 
              href={isLocked ? '/upgrade' : `/workouts/${workout._id}`} 
              key={workout._id.toString()} 
              className={`bg-surface-container-low rounded-2xl p-4 flex gap-4 items-center group active:scale-[0.98] transition-all border border-transparent hover:border-primary/20 ${isLocked ? 'opacity-60 grayscale' : ''}`}
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative">
                <img src={workout.mediaUrl || 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {workout.tier === 'premium' && <span className="text-[8px] font-black uppercase tracking-widest bg-tertiary text-on-tertiary-fixed px-1.5 py-0.5 rounded">ELITE</span>}
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{workout.categories?.[0] || 'MIX'}</span>
                </div>
                <h3 className="font-headline font-bold text-white uppercase truncate">{workout.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[12px]">schedule</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider">45m</span>
                  </div>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-colors">
                <span className="material-symbols-outlined flex">{isLocked ? 'lock' : 'play_arrow'}</span>
              </div>
            </Link>
          );
        })}
      </div>
    )}
  </section>
</main>
  );
}
