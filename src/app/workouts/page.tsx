import mongoose from 'mongoose';
import Workout from '@/models/Workout';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';

// Force dynamic fetch to ensure new workouts show up
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
  if (mongoose.connection.readyState !== 1 && process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  // Fetch dummy workouts
  let docs: any[] = [];
  try {
    docs = await Workout.find().lean() || [];
  } catch (e) {
    console.error("DB Error", e);
  }

  const allBasicWorkouts = docs.filter(w => w.tier === 'basic' || !w.tier);
  const premiumWorkouts = docs.filter(w => w.tier === 'premium');

  const basicWorkouts = currentFocus === 'All'
    ? allBasicWorkouts
    : allBasicWorkouts.filter(w => w.categories && w.categories.map((c: string) => c.toUpperCase()).includes(currentFocus.toUpperCase()));

  const filters = [
    { label: 'All Focus', value: 'All' },
    { label: 'Chest', value: 'Chest' },
    { label: 'Back', value: 'Back' },
    { label: 'Legs', value: 'Legs' },
    { label: 'Arms', value: 'Arms' },
    { label: 'Core', value: 'Core' },
    { label: 'Mix', value: 'Mix' }
  ];

  return (
    <main className="pt-24 pb-32 px-6 space-y-12">
      {/* Body Part Selector */}
      <section className="mb-10 overflow-hidden">
        <h2 className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-4">Target Focus</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {filters.map(f => {
            const isActive = currentFocus === f.value;
            return (
              <Link
                key={f.value}
                href={`?focus=${f.value}`}
                className={`px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest whitespace-nowrap active:scale-95 transition-transform ${isActive
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-high text-on-surface-variant'
                  }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Basic Workout Plans */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-headline text-3xl font-extrabold uppercase italic tracking-tighter text-white">Basic Plans</h2>
            <p className="text-on-surface-variant text-sm font-medium">Foundation series for elite performance</p>
          </div>
        </div>

        {basicWorkouts.length === 0 && (
          <p className="text-outline my-8 text-sm italic">No basic workouts explicitly set for this focus yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {basicWorkouts.map((workout: any) => (
            <Link href={`/workouts/${workout._id}`} key={workout._id.toString()} className="group relative rounded-xl overflow-hidden bg-surface-container-low active:scale-[0.98] transition-all block">
              <div className="h-48 w-full overflow-hidden relative">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={workout.title} src={workout.mediaUrl || "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800"} />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent"></div>
                <div className="absolute top-4 right-4 glass-card px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">bolt</span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Intermediate</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-headline text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{workout.title}</h3>
                <div className="flex items-center gap-4 text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span className="text-xs font-bold uppercase tracking-wider">45 Mins</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">fitness_center</span>
                    <span className="text-xs font-bold uppercase tracking-wider">{workout.categories?.[0] || 'Full Body'}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Premium Section */}
      <section className="mt-20">
        <div className="flex items-center gap-4 mb-8">
          <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
          <h2 className="font-headline text-3xl font-extrabold uppercase italic tracking-tighter text-tertiary">Premium Series</h2>
        </div>

        <div className="space-y-6">
          {premiumWorkouts.map((workout: any) => (
            <Link href={isPremium ? `/workouts/${workout._id}` : `/upgrade`} key={workout._id.toString()} className="block relative group rounded-2xl p-[1px] bg-gradient-to-br from-tertiary/40 via-surface-container-highest to-surface-container-lowest">
              <div className="bg-surface-container-lowest rounded-[calc(1.5rem-1px)] p-6 flex items-center justify-between overflow-hidden relative">
                <div className="relative z-10 w-full flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black bg-tertiary text-on-tertiary-fixed px-2 py-0.5 rounded tracking-[0.2em]">ELITE</span>
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Premium Only</span>
                    </div>
                    <h3 className="font-headline text-2xl font-bold text-white mb-2">{workout.title}</h3>
                    <div className="flex items-center gap-4 text-on-surface-variant">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">timer</span>
                        <span className="text-xs font-bold uppercase tracking-wider">60-90 Mins</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span className="text-xs font-bold uppercase tracking-wider">{workout.categories?.[0] || 'Max Intensity'}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {/* Conditionally rendering lock icon */}
                    {!isPremium && <span className="material-symbols-outlined text-[60px] text-tertiary md:text-[80px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>}
                    {isPremium && <span className="material-symbols-outlined text-[40px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Unlock CTA conditionally rendered */}
        {!isPremium && (
        <div className="mt-10 p-8 rounded-[2rem] bg-gradient-to-br from-tertiary via-tertiary-dim to-tertiary-container text-on-tertiary-fixed-variant text-center relative overflow-hidden shadow-[0_10px_40px_rgba(255,221,121,0.15)]">
          <div className="relative z-10">
            <h3 className="font-headline text-3xl font-black italic tracking-tighter uppercase mb-2">Break Your Limits</h3>
            <p className="font-bold text-sm mb-6 uppercase tracking-wider opacity-80">Access elite programs &amp; world-class coaching</p>
            <Link href="/upgrade" className="inline-block bg-on-tertiary-fixed text-tertiary px-10 py-4 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-transform">Unlock Premium</Link>
          </div>
          <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 pointer-events-none">
            <span className="material-symbols-outlined text-[120px] text-white/20" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
          </div>
        </div>
        )}
      </section>
    </main>
  );
}
