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
  
  revalidatePath('/admin/marketing');
  redirect('/admin/marketing');
}
