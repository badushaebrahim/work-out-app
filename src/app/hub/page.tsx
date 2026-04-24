import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import HubCalculators from './HubCalculators';
import Header from '@/components/Header';

export default async function HubPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  let isPremium = false;
  let savedMetrics = { bmi: 0, bodyFat: 0, dailyCalories: 0 };

  if (token) {
    try {
      const decoded = await verifyJwt(token);
      if (decoded && decoded.userId) {
        await connectToDatabase();
        
        const user = await User.findById(decoded.userId).lean();
        if (user) {
          if (user.role === 'premium' || user.role === 'admin') {
            isPremium = true;
          }
          if (user.metrics) {
            savedMetrics = {
              bmi: user.metrics.bmi || 0,
              bodyFat: user.metrics.bodyFat || 0,
              dailyCalories: user.metrics.dailyCalories || 0
            };
          }
        }
      }
    } catch (e) {
      console.error("Token verification failed in hub", e);
    }
  }

  return (
    <main className="min-h-screen bg-surface flex flex-col pb-32">
      <Header />
      
      <div className="pt-24 px-6 max-w-md mx-auto w-full space-y-6">
        <div className="mb-8">
          <h1 className="font-headline font-black text-3xl uppercase tracking-widest text-[#f3ffca]">Performance Hub</h1>
          <p className="text-on-surface-variant font-medium text-sm mt-2">Calculate and track your foundational metrics.</p>
        </div>

        <HubCalculators isPremium={isPremium} initialMetrics={savedMetrics} />
      </div>
    </main>
  );
}
