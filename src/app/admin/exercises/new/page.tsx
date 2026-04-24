"use client";

import { useState } from "react";
import { createExercise } from "@/app/admin/actions";
import Link from "next/link";

export default function NewExercisePage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-headline font-black text-3xl uppercase tracking-widest text-white mb-2">New Exercise</h1>
          <p className="text-on-surface-variant font-medium">Add a new exercise to the master database.</p>
        </div>
        <Link href="/admin" className="material-symbols-outlined text-[#CCFF00] active:scale-95 transition-transform text-3xl">arrow_back</Link>
      </div>

      <form action={async (formData) => {
        setLoading(true);
        await createExercise(formData);
      }} className="space-y-6">

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Exercise Name</label>
            <input required name="name" type="text" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" placeholder="e.g. BARBELL CURL" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Category</label>
            <select required name="categories" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white focus:ring-1 focus:ring-[#CCFF00]/30 outline-none appearance-none">
              <option value="CHEST">Chest</option>
              <option value="BACK">Back</option>
              <option value="LEGS">Legs</option>
              <option value="ARMS">Arms</option>
              <option value="CORE">Core</option>
              <option value="MIX">Mix / Full Body</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Type</label>
            <input required name="type" type="text" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" placeholder="e.g. Isolation • Pull" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Sets</label>
              <input required name="sets" type="number" min="1" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" placeholder="4" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Reps</label>
              <input required name="reps" type="text" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" placeholder="10" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Rest Time</label>
          <input required name="rest" type="text" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" placeholder="90s" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Execution Steps (One per line)</label>
          <textarea required name="executionSteps" rows={4} className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" placeholder="Curl weight up&#10;Slow eccentric"></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Trainer Insight</label>
          <textarea name="trainerInsight" rows={3} className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" placeholder="Do not swing your back."></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Image URL</label>
          <textarea name="imageUrl" rows={4} className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" placeholder="Do not swing your back."></textarea>
        </div>

        <button disabled={loading} type="submit" className="w-full bg-[#CCFF00] text-black font-headline font-black py-4 rounded-xl uppercase tracking-widest active:scale-95 transition-transform disabled:opacity-50 mt-8">
          {loading ? "Saving..." : "Save Exercise"}
        </button>
      </form>
    </div>
  );
}
