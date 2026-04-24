import mongoose from 'mongoose';
import Workout from '@/models/Workout';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ExerciseAccordion from '@/components/ExerciseAccordion';

export default async function WorkoutDetailList({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Connect to DB wrapper
  if (mongoose.connection.readyState !== 1 && process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  let workout = null;
  try {
    const rawWorkout = await Workout.findById(id).lean();
    if (rawWorkout) {
      workout = JSON.parse(JSON.stringify(rawWorkout));
    }
  } catch (e) {
    console.error("DB Error", e);
  }

  if (!workout) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-surface">
      <header className="fixed top-0 w-full z-50 bg-[#0e0e0e]/80 backdrop-blur-xl flex justify-between items-center px-6 h-20 shadow-[0_40px_40px_-15px_rgba(243,255,202,0.08)]">
        <div className="flex items-center gap-4">
          <Link href="/workouts" className="material-symbols-outlined text-[#f3ffca] text-2xl active:scale-95 transition-transform">arrow_back</Link>
          <div className="flex flex-col">
            <h1 className="font-headline uppercase tracking-tighter font-bold text-xl leading-tight font-black tracking-widest text-[#f3ffca]">
              {workout.title}
            </h1>
            <p className="text-[10px] text-[#f3ffca]/80 tracking-widest uppercase">{workout.categories?.[0] || 'Mix'} • {workout.exercises?.length || 0} Sets</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-[#f3ffca] overflow-hidden active:scale-95 transition-transform">
          <img className="w-full h-full object-cover" src={workout?.imageUrl ? workout.imageUrl : 'https://lh3.googleusercontent.com/aida-public/AB6AXuChQ8QJTFM59IAjZ85MS9GDrazGOSJJrI8TVo2lyWP9tuPo6vgMzRjVJWsefE9PJIaXJizkebeVLqmHfAe9sP-h-jZIkjBHBpNG0bl2y-YeRwqzGPsjEgIY_fPRSfYxsErIs1eTrpAghq4PlQAhCXA1HkF0T83_DMV6sLsBBmQ9wj_Al4ehAhj6yt7pDJJdsEUejpvqTs_VKd8TgcTRHk73OG3gIM0nf8j4hEoXF60aomvRm1lVAhVduMoVe-JPA5qF2g0P0jndLd8'} />
        </div>
      </header>

      <div className="pt-24 pb-32 px-4 max-w-md mx-auto space-y-3">
        {(!workout.exercises || workout.exercises.length === 0) ? (
          <div className="bg-surface-container-low p-8 rounded-3xl text-center border border-primary/20 mt-12">
            <p className="text-on-surface-variant font-medium">No exercises have been configured for this workout yet.</p>
          </div>
        ) : (
          workout.exercises.map((ex: any, idx: number) => (
            <ExerciseAccordion key={idx} exercise={ex} index={idx} />
          ))
        )}
      </div>
    </main>
  );
}
