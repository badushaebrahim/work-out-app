import mongoose from 'mongoose';
import Workout from '@/models/Workout';
import connectToDatabase from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await connectToDatabase();
  
  const workouts = await Workout.find().sort({ createdAt: -1 }).limit(10).lean();
  
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-headline font-black text-4xl uppercase text-white mb-2">Command Center</h1>
        <p className="text-on-surface-variant font-medium">Manage platform content and access distribution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-high rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
          <div className="relative z-10">
            <span className="material-symbols-outlined text-[#CCFF00] mb-4">fitness_center</span>
            <h3 className="font-headline font-bold uppercase tracking-widest text-white text-sm mb-1">Total Workouts</h3>
            <p className="font-black text-4xl text-white">{workouts.length}</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#CCFF00]/10 rounded-full blur-xl group-hover:bg-[#CCFF00]/20 transition-colors"></div>
        </div>
        <div className="bg-surface-container-high rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
          <div className="relative z-10">
            <span className="material-symbols-outlined text-[#CCFF00] mb-4">group</span>
            <h3 className="font-headline font-bold uppercase tracking-widest text-white text-sm mb-1">Active Athletes</h3>
            <p className="font-black text-4xl text-white">24</p>
          </div>
        </div>
        <div className="bg-surface-container-high rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
          <div className="relative z-10">
            <span className="material-symbols-outlined text-[#CCFF00] mb-4">verified</span>
            <h3 className="font-headline font-bold uppercase tracking-widest text-white text-sm mb-1">Premium Users</h3>
            <p className="font-black text-4xl text-white">8</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-2xl border border-white/5 p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline font-bold text-xl uppercase tracking-widest text-white">Recent Workouts</h2>
          <Link href="/admin/workouts/new" className="bg-[#CCFF00] text-black px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs active:scale-95 transition-transform flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span> Add New
          </Link>
        </div>
        
        <div className="space-y-4">
          {workouts.length === 0 ? (
            <p className="text-on-surface-variant font-medium text-center py-8">No workouts configured yet.</p>
          ) : (
            workouts.map((workout: any) => (
              <div key={workout._id.toString()} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-highest border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-lowest overflow-hidden">
                    <img src={workout.mediaUrl || "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=200"} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-wider">{workout.title}</h4>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${workout.tier === 'premium' ? 'bg-tertiary text-black' : 'bg-surface-container text-on-surface-variant'}`}>
                      {workout.tier || 'basic'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors">edit</button>
                  <button className="material-symbols-outlined text-error hover:text-error-dim transition-colors">delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
