import mongoose from "mongoose";
import Workout from "@/models/Workout";
import { updateWorkout } from "@/app/admin/actions";
import { UploadDropzone } from "@/lib/uploadthing";
import { notFound } from "next/navigation";
import connectToDatabase from '@/lib/db';
import ExerciseImporter from "@/components/ExerciseImporter";

export default async function EditWorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await connectToDatabase();
  const workout = await Workout.findById(id).lean();
  if (!workout) notFound();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-headline font-black text-3xl uppercase tracking-widest text-[#CCFF00] mb-2">Modify Workout</h1>
        <p className="text-on-surface-variant font-medium">Update the specifics of {workout.title}</p>
      </div>

      {/* Note: In App Router Server component, you can't use useState for the image dropzone easily without making a client wrapper. 
          To keep it clean, we use a simple hidden input and Client Component just for the upload. We'll simplify here and use a functional form  */}
      <form action={async (formData) => {
        'use server';
        await updateWorkout(id, formData);
      }} className="space-y-6">

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Workout Title</label>
          <input defaultValue={workout.title} required name="title" type="text" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Visibility Tier</label>
            <select defaultValue={workout.tier || 'basic'} required name="tier" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white focus:ring-1 focus:ring-[#CCFF00]/30 outline-none appearance-none">
              <option value="basic">Basic (Free Trial)</option>
              <option value="premium">Premium (Paid Only)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Target Focus</label>
            <select defaultValue={workout.categories?.[0] || 'CHEST'} required name="category" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white focus:ring-1 focus:ring-[#CCFF00]/30 outline-none appearance-none">
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
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Reset Schedule</label>
          <select defaultValue={(workout as any).resetCycle || 'never'} name="resetCycle" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white focus:ring-1 focus:ring-[#CCFF00]/30 outline-none appearance-none">
            <option value="never">Never — Always Available</option>
            <option value="daily">Daily — Resets at Midnight</option>
            <option value="weekly">Weekly — Resets Every Monday</option>
            <option value="monthly">Monthly — Resets 1st of Month</option>
            <option value="yearly">Yearly — Resets Jan 1st</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Detailed Description</label>
          <textarea defaultValue={workout.description} required name="description" rows={4} className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none"></textarea>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Exercises (JSON Array)</label>
            <ExerciseImporter targetId="exercises-input-edit" />
          </div>
          <textarea id="exercises-input-edit" defaultValue={workout.exercises ? JSON.stringify(workout.exercises, null, 2) : "[\n\n]"} name="exercises" rows={6} className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none font-mono text-xs" placeholder='[{"name": "Bench Press", "type": "Compound", "sets": 4, "reps": "8-12", "rest": "90s", "executionSteps": ["Step 1"], "trainerInsight": "Note"}]'></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Current Media URL (Paste new string to change)</label>
          <input defaultValue={workout.mediaUrl} required name="mediaUrl" type="url" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" />
          <div className="mt-2 rounded-xl overflow-hidden relative h-48 border border-white/5 opacity-50 block">
            <img src={workout.mediaUrl || ''} className="w-full h-full object-cover" />
          </div>
        </div>

        <button type="submit" className="w-full bg-[#CCFF00] text-black font-headline font-black py-4 rounded-xl uppercase tracking-widest active:scale-95 transition-transform mt-8">
          Save Changes
        </button>
      </form>
    </div>
  );
}
