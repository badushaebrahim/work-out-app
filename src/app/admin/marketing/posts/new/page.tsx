"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { createPost } from "@/app/admin/actions";

export default function NewPostPage() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-headline font-black text-3xl uppercase tracking-widest text-[#CCFF00] mb-2">Publish Journal</h1>
        <p className="text-on-surface-variant font-medium">Draft a new post for the athletes community.</p>
      </div>

      <form action={async (formData) => {
        setLoading(true);
        if (imageUrl) formData.append('imageUrl', imageUrl);
        await createPost(formData);
      }} className="space-y-6">
        
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Title</label>
          <input required name="title" type="text" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" placeholder="e.g. 5 Ways to Optimize Recovery" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Category</label>
            <select required name="category" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white focus:ring-1 focus:ring-[#CCFF00]/30 outline-none appearance-none">
              <option value="NUTRITION">Nutrition</option>
              <option value="TRAINING">Training</option>
              <option value="MINDSET">Mindset</option>
              <option value="ANNOUNCEMENT">Announcement</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Short Excerpt</label>
          <input required maxLength={200} name="excerpt" type="text" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" placeholder="A brief hook..." />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Article Body</label>
          <textarea required name="content" rows={10} className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" placeholder="Write your post here..."></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Cover Graphic</label>
          {imageUrl ? (
            <div className="rounded-xl overflow-hidden relative h-48 border border-white/5">
              <img src={imageUrl} alt="Uploaded" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => setImageUrl("")}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ) : (
            <div className="bg-surface-container-highest rounded-xl p-2 border border-dashed border-white/10 relative z-10">
              <UploadDropzone
                endpoint="workoutMedia"
                onClientUploadComplete={(res) => {
                  if (res && res.length > 0) setImageUrl(res[0].url);
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
                appearance={{
                  container: "bg-transparent py-8",
                  button: "bg-[#CCFF00] text-black font-bold uppercase tracking-widest text-xs py-2 px-6 rounded-full after:bg-[#CCFF00]",
                  label: "text-on-surface-variant",
                  allowedContent: "text-on-surface-variant/50"
                }}
              />
            </div>
          )}
        </div>

        <button disabled={loading || !imageUrl} type="submit" className="w-full bg-gradient-to-r from-primary to-primary-container text-black font-headline font-black py-4 rounded-xl uppercase tracking-widest active:scale-95 transition-transform disabled:opacity-50 mt-8">
          {loading ? "Publishing..." : "Publish Article"}
        </button>
      </form>
    </div>
  );
}
