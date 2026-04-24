import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import { updatePost } from "@/app/admin/actions";
import { notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  await connectToDatabase();

  const post = await Post.findById(id).lean();
  if (!post) notFound();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-headline font-black text-3xl uppercase tracking-widest text-[#CCFF00] mb-2">Modify Journal</h1>
        <p className="text-on-surface-variant font-medium">Update the article: {post.title}</p>
      </div>

      <form action={async (formData) => {
        'use server';
        await updatePost(id, formData);
      }} className="space-y-6">
        
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Title</label>
          <input defaultValue={post.title} required name="title" type="text" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Category</label>
            <select defaultValue={post.category || 'NUTRITION'} required name="category" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white focus:ring-1 focus:ring-[#CCFF00]/30 outline-none appearance-none">
              <option value="NUTRITION">Nutrition</option>
              <option value="TRAINING">Training</option>
              <option value="MINDSET">Mindset</option>
              <option value="ANNOUNCEMENT">Announcement</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Short Excerpt</label>
          <input defaultValue={post.excerpt} required maxLength={200} name="excerpt" type="text" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Article Body</label>
          <textarea defaultValue={post.content} required name="content" rows={10} className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none"></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Current Cover Graphic URL (Paste new string to change)</label>
          <input defaultValue={post.imageUrl} required name="imageUrl" type="url" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" />
          <div className="mt-2 rounded-xl overflow-hidden relative h-48 border border-white/5 opacity-50 block">
             <img src={post.imageUrl} className="w-full h-full object-cover" />
          </div>
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-primary to-primary-container text-black font-headline font-black py-4 rounded-xl uppercase tracking-widest active:scale-95 transition-transform mt-8">
          Save Changes
        </button>
      </form>
    </div>
  );
}
