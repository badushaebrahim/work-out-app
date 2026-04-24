'use server';

import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function saveHubMetrics(metrics: { bmi?: number; bodyFat?: number; dailyCalories?: number }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  try {
    const decoded = await verifyJwt(token);
    if (!decoded || !decoded.userId) {
      return { success: false, error: 'Invalid token.' };
    }

    await connectToDatabase();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return { success: false, error: 'User not found.' };
    }

    if (user.role !== 'premium' && user.role !== 'admin') {
      return { success: false, error: 'Premium feature. Please upgrade to save metrics.' };
    }

    // Merge new metrics intelligently so we don't wipe out ones they didn't submit
    user.metrics = {
      ...(user.metrics || {}),
      ...(metrics.bmi !== undefined && { bmi: metrics.bmi }),
      ...(metrics.bodyFat !== undefined && { bodyFat: metrics.bodyFat }),
      ...(metrics.dailyCalories !== undefined && { dailyCalories: metrics.dailyCalories })
    };

    await user.save();

    return { success: true };
  } catch (error: any) {
    console.error("Save metrics error", error);
    return { success: false, error: error.message || 'Failed to save metrics.' };
  }
}
