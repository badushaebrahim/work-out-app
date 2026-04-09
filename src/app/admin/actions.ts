'use server';

import connectToDatabase from '@/lib/db';
import Workout from '@/models/Workout';
import BannerAd from '@/models/BannerAd';
import Post from '@/models/Post';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createWorkout(formData: FormData) {
  await connectToDatabase();
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const tier = formData.get('tier') as string;
  const category = formData.get('category') as string;
  const mediaUrl = formData.get('mediaUrl') as string;
  
  await Workout.create({
    title,
    description,
    tier,
    categories: [category],
    mediaUrl,
    mediaType: 'image'
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

  const updateData: any = { title, description, tier, categories: [category] };
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
