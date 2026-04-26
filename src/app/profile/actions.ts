'use server';

import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Complaint from '@/models/Complaint';
import TrainerQuery from '@/models/TrainerQuery';

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  if (!token) return null;

  const decoded = await verifyJwt(token);
  if (!decoded || !decoded.userId) return null;

  await connectToDatabase();
  const user = await User.findById(decoded.userId).lean();
  if (!user) return null;

  return user;
}

export async function submitComplaint(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: 'You must be logged in to submit a complaint.' };
  }

  const subject = (formData.get('subject') as string)?.trim();
  const message = (formData.get('message') as string)?.trim();
  const type = (formData.get('type') as string) || 'query';

  if (!subject || !message) {
    return { success: false, error: 'Subject and message are required.' };
  }

  if (subject.length > 200) {
    return { success: false, error: 'Subject must be under 200 characters.' };
  }

  if (message.length > 2000) {
    return { success: false, error: 'Message must be under 2000 characters.' };
  }

  try {
    await connectToDatabase();
    await Complaint.create({
      userId: user._id,
      userEmail: user.email || '',
      userName: user.userName || '',
      subject,
      message,
      type: type === 'complaint' ? 'complaint' : 'query',
      status: 'pending',
    });

    return { success: true };
  } catch (err) {
    console.error('Error submitting complaint:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

export async function submitTrainerQuery(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: 'You must be logged in to submit a trainer inquiry.' };
  }

  const trainerName = (formData.get('trainerName') as string)?.trim();
  const experience = (formData.get('experience') as string)?.trim();
  const message = (formData.get('message') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim() || '';

  if (!trainerName || !experience || !message) {
    return { success: false, error: 'Trainer name, experience, and message are required.' };
  }

  if (message.length > 2000) {
    return { success: false, error: 'Message must be under 2000 characters.' };
  }

  try {
    await connectToDatabase();
    await TrainerQuery.create({
      userId: user._id,
      userEmail: user.email || '',
      userName: user.userName || '',
      trainerName,
      experience,
      message,
      phone,
      status: 'pending',
    });

    return { success: true };
  } catch (err) {
    console.error('Error submitting trainer query:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
