"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { createWorkout } from "@/app/admin/actions";

export default function NewWorkoutPage() {
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-headline font-black text-3xl uppercase tracking-widest text-white mb-2">Configure Workout</h1>
        <p className="text-on-surface-variant font-medium">Add a new elite session to the database.</p>
      </div>

      <form action={async (formData) => {
        setLoading(true);
        if (mediaUrl) formData.append('mediaUrl', mediaUrl);
        await createWorkout(formData);
      }} className="space-y-6">
        
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Workout Title</label>
          <input required name="title" type="text" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" placeholder="e.g. Titan Ascend" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Visibility Tier</label>
            <select required name="tier" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white focus:ring-1 focus:ring-[#CCFF00]/30 outline-none appearance-none">
              <option value="basic">Basic (Free Trial)</option>
              <option value="premium">Premium (Paid Only)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Target Focus</label>
            <select required name="category" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white focus:ring-1 focus:ring-[#CCFF00]/30 outline-none appearance-none">
              <option value="CHEST">Chest</option>
              <option value="BACK">Back</option>
              <option value="LEGS">Legs</option>
              <option value="ARMS">Arms</option>
              <option value="CORE">Core</option>
              <option value="MIX">Mix / Full Body</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Detailed Description</label>
          <textarea required name="description" rows={4} className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" placeholder="Enter instructional details..."></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Exercises (JSON Array)</label>
          <textarea name="exercises" rows={6} className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none font-mono text-xs" placeholder='[{"name": "Bench Press", "type": "Compound", "sets": 4, "reps": "8-12", "rest": "90s", "executionSteps": ["Step 1"], "trainerInsight": "Note"}]'></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Cover Media Source</label>
          {mediaUrl ? (
            <div className="rounded-xl overflow-hidden relative h-48 border border-white/5">
              <img src={mediaUrl} alt="Uploaded" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => setMediaUrl("")}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ) : (
            <div className="bg-surface-container-highest rounded-xl p-2 border border-dashed border-white/10">
              <UploadDropzone
                endpoint="workoutMedia"
                onClientUploadComplete={(res) => {
                  if (res && res.length > 0) setMediaUrl(res[0].url);
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
                appearance={{
                  container: "bg-transparent",
                  button: "bg-[#CCFF00] text-black font-bold uppercase tracking-widest text-xs py-2 px-6 rounded-full after:bg-[#CCFF00]",
                  label: "text-on-surface-variant",
                  allowedContent: "text-on-surface-variant/50"
                }}
              />
            </div>
          )}
        </div>

        <button disabled={loading} type="submit" className="w-full bg-[#CCFF00] text-black font-headline font-black py-4 rounded-xl uppercase tracking-widest active:scale-95 transition-transform disabled:opacity-50 mt-8">
          {loading ? "Publishing..." : "Launch Workout"}
        </button>
      </form>
    </div>
  );
}
