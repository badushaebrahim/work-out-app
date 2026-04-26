'use server';

import connectToDatabase from '@/lib/db';
import Workout from '@/models/Workout';
import BannerAd from '@/models/BannerAd';
import Post from '@/models/Post';
import Exercise from '@/models/Exercise';
import Complaint from '@/models/Complaint';
import TrainerQuery from '@/models/TrainerQuery';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createWorkout(formData: FormData) {
  await connectToDatabase();
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const tier = formData.get('tier') as string;
  const category = formData.get('category') as string;
  const mediaUrl = formData.get('mediaUrl') as string;
  const exercisesRaw = formData.get('exercises') as string;
  const resetCycle = (formData.get('resetCycle') as string) || 'never';
  let exercises = [];
  try {
    if (exercisesRaw) {
      exercises = JSON.parse(exercisesRaw);
    }
  } catch(e) {}
  
  await Workout.create({
    title,
    description,
    tier,
    categories: [category],
    mediaUrl,
    mediaType: 'image',
    exercises,
    resetCycle
  });
  
  revalidatePath('/admin');
  revalidatePath('/workouts');
  redirect('/admin');
}

export async function createBannerAd(formData: FormData) {
  await connectToDatabase();
  
  const title = formData.get('title') as string;
  const redirectUrl = formData.get('redirectUrl') as string;
  const imageUrl = formData.get('imageUrl') as string;
  
  await BannerAd.create({
    title,
    redirectUrl,
    imageUrl,
    active: true
  });
  
  revalidatePath('/admin/marketing');
  redirect('/admin/marketing');
}

export async function createPost(formData: FormData) {
  await connectToDatabase();
  
  const title = formData.get('title') as string;
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const category = formData.get('category') as string;
  const imageUrl = formData.get('imageUrl') as string;
  
  await Post.create({
    title,
    excerpt,
    content,
    category,
    imageUrl,
    author: 'Elite Admin',
    active: true
  });
  
  revalidatePath('/admin');
  revalidatePath('/admin/marketing');
  redirect('/admin/marketing');
}

export async function deleteWorkout(id: string) {
  await connectToDatabase();
  await Workout.findByIdAndDelete(id);
  revalidatePath('/admin');
}

export async function deleteBannerAd(id: string) {
  await connectToDatabase();
  await BannerAd.findByIdAndDelete(id);
  revalidatePath('/admin');
  revalidatePath('/admin/marketing');
}

export async function deletePost(id: string) {
  await connectToDatabase();
  await Post.findByIdAndDelete(id);
  revalidatePath('/admin');
  revalidatePath('/admin/marketing');
}

export async function updateWorkout(id: string, formData: FormData) {
  await connectToDatabase();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const tier = formData.get('tier') as string;
  const category = formData.get('category') as string;
  const mediaUrl = formData.get('mediaUrl') as string;
  const exercisesRaw = formData.get('exercises') as string;
  const resetCycle = (formData.get('resetCycle') as string) || 'never';
  let exercises;
  try {
    if (exercisesRaw) {
      exercises = JSON.parse(exercisesRaw);
    }
  } catch(e) {}

  const updateData: any = { title, description, tier, categories: [category], resetCycle };
  if (exercises) updateData.exercises = exercises;
  if (mediaUrl) updateData.mediaUrl = mediaUrl;

  await Workout.findByIdAndUpdate(id, updateData);
  revalidatePath('/admin');
  revalidatePath('/workouts');
  redirect('/admin');
}

export async function updateBannerAd(id: string, formData: FormData) {
  await connectToDatabase();
  const title = formData.get('title') as string;
  const redirectUrl = formData.get('redirectUrl') as string;
  const imageUrl = formData.get('imageUrl') as string;

  const updateData: any = { title, redirectUrl };
  if (imageUrl) updateData.imageUrl = imageUrl;

  await BannerAd.findByIdAndUpdate(id, updateData);
  revalidatePath('/admin');
  revalidatePath('/admin/marketing');
  redirect('/admin'); // or /admin/marketing depending on layout
}

export async function updatePost(id: string, formData: FormData) {
  await connectToDatabase();
  const title = formData.get('title') as string;
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const category = formData.get('category') as string;
  const imageUrl = formData.get('imageUrl') as string;

  const updateData: any = { title, excerpt, content, category };
  if (imageUrl) updateData.imageUrl = imageUrl;

  await Post.findByIdAndUpdate(id, updateData);
  revalidatePath('/admin');
  revalidatePath('/admin/marketing');
  redirect('/admin/marketing');
}

export async function createExercise(formData: FormData) {
  await connectToDatabase();
  
  const name = formData.get('name') as string;
  const categories = formData.get('categories') as string;
  const type = formData.get('type') as string;
  const sets = parseInt(formData.get('sets') as string, 10);
  const reps = formData.get('reps') as string;
  const rest = formData.get('rest') as string;
  const executionStepsRaw = formData.get('executionSteps') as string;
  const executionSteps = executionStepsRaw ? executionStepsRaw.split('\n').filter(s => s.trim() !== '') : [];
  const trainerInsight = formData.get('trainerInsight') as string;
  const imageUrl = formData.get('imageUrl') as string;
  
  await Exercise.create({
    name,
    categories,
    type,
    sets,
    reps,
    rest,
    executionSteps,
    trainerInsight,
    imageUrl: imageUrl || '',
  });
  
  revalidatePath('/admin');
  redirect('/admin');
}

export async function updateExercise(id: string, formData: FormData) {
  await connectToDatabase();
  
  const name = formData.get('name') as string;
  const categories = formData.get('categories') as string;
  const type = formData.get('type') as string;
  const sets = parseInt(formData.get('sets') as string, 10);
  const reps = formData.get('reps') as string;
  const rest = formData.get('rest') as string;
  const executionStepsRaw = formData.get('executionSteps') as string;
  const executionSteps = executionStepsRaw ? executionStepsRaw.split('\n').filter(s => s.trim() !== '') : [];
  const trainerInsight = formData.get('trainerInsight') as string;

  await Exercise.findByIdAndUpdate(id, {
    name,
    categories,
    type,
    sets,
    reps,
    rest,
    executionSteps,
    trainerInsight
  });
  
  revalidatePath('/admin');
  redirect('/admin');
}

export async function deleteExercise(id: string) {
  await connectToDatabase();
  await Exercise.findByIdAndDelete(id);
  revalidatePath('/admin');
}

export async function getExercises() {
  await connectToDatabase();
  const exercises = await Exercise.find().sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(exercises));
}

// COMPLAINTS
export async function getComplaints() {
  await connectToDatabase();
  const complaints = await Complaint.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(complaints));
}

export async function updateComplaintStatus(id: string, status: string, adminNotes: string) {
  await connectToDatabase();
  await Complaint.findByIdAndUpdate(id, { status, adminNotes });
  revalidatePath('/admin/complaints');
}

export async function deleteComplaint(id: string) {
  await connectToDatabase();
  await Complaint.findByIdAndDelete(id);
  revalidatePath('/admin/complaints');
}

// TRAINER QUERIES
export async function getTrainerQueries() {
  await connectToDatabase();
  const queries = await TrainerQuery.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(queries));
}

export async function updateTrainerQueryStatus(id: string, status: string, adminNotes: string) {
  await connectToDatabase();
  await TrainerQuery.findByIdAndUpdate(id, { status, adminNotes });
  revalidatePath('/admin/trainers');
}

export async function deleteTrainerQuery(id: string) {
  await connectToDatabase();
  await TrainerQuery.findByIdAndDelete(id);
  revalidatePath('/admin/trainers');
}
