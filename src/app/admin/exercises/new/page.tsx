"use client";

import { useState, useRef } from "react";
import { createExercise } from "@/app/admin/actions";
import Link from "next/link";

type GenerationStep = 'idle' | 'generating' | 'uploading' | 'done' | 'error';

export default function NewExercisePage() {
  const [loading, setLoading] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [genStep, setGenStep] = useState<GenerationStep>('idle');
  const [genMessage, setGenMessage] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      if (autoGenerate) {
        // Step 1: Generate image with AI
        setGenStep('generating');
        setGenMessage('🧠 Nano Banana AI is generating your exercise image...');

        const name = formData.get('name') as string;
        const category = formData.get('categories') as string;
        const type = formData.get('type') as string;
        const executionStepsRaw = formData.get('executionSteps') as string;
        const executionSteps = executionStepsRaw
          ? executionStepsRaw.split('\n').filter(s => s.trim() !== '')
          : [];

        const genRes = await fetch('/api/generate-exercise-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, category, type, executionSteps }),
        });

        if (!genRes.ok) {
          const err = await genRes.json();
          throw new Error(err.message || 'Image generation failed');
        }

        const { imageBase64, mimeType } = await genRes.json();

        // Show preview
        setPreviewImage(`data:${mimeType};base64,${imageBase64}`);

        // Step 2: Upload via UploadThing
        setGenStep('uploading');
        setGenMessage('📤 Uploading image to cloud storage...');

        // Convert base64 to File
        const byteCharacters = atob(imageBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const ext = mimeType.includes('png') ? 'png' : 'jpg';
        const blob = new Blob([byteArray], { type: mimeType });
        const file = new File([blob], `exercise_${Date.now()}.${ext}`, { type: mimeType });

        // Upload using UploadThing's API
        const uploadFormData = new FormData();
        uploadFormData.append('files', file);

        // Use the UploadThing client-side upload
        const { generateReactHelpers } = await import('@uploadthing/react');
        const { uploadFiles } = generateReactHelpers<any>();
        
        const uploadResult = await uploadFiles('workoutMedia', {
          files: [file],
        });

        if (!uploadResult || uploadResult.length === 0) {
          throw new Error('Upload failed');
        }

        const uploadedUrl = uploadResult[0].ufsUrl || uploadResult[0].url;
        setGeneratedImageUrl(uploadedUrl);
        formData.set('imageUrl', uploadedUrl);

        setGenStep('done');
        setGenMessage('✅ Image generated and uploaded successfully!');
      }

      // Step 3: Save the exercise
      await createExercise(formData);
    } catch (err: any) {
      console.error('Exercise creation error:', err);
      setGenStep('error');
      setGenMessage(`❌ ${err.message || 'Something went wrong'}`);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-headline font-black text-3xl uppercase tracking-widest text-white mb-2">New Exercise</h1>
          <p className="text-on-surface-variant font-medium">Add a new exercise to the master database.</p>
        </div>
        <Link href="/admin" className="material-symbols-outlined text-[#CCFF00] active:scale-95 transition-transform text-3xl">arrow_back</Link>
      </div>

      {/* Full-screen loader overlay during AI generation */}
      {loading && genStep !== 'idle' && genStep !== 'done' && genStep !== 'error' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8">
          <div className="bg-surface-container-low rounded-2xl border border-white/10 p-10 max-w-md w-full text-center space-y-6">
            {/* Animated loader */}
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-[#CCFF00]/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#CCFF00] animate-spin"></div>
              <span className="absolute inset-0 flex items-center justify-center text-3xl">
                {genStep === 'generating' ? '🧠' : '📤'}
              </span>
            </div>

            <div>
              <h2 className="font-headline font-bold text-xl text-white uppercase tracking-widest mb-2">
                {genStep === 'generating' ? 'Generating Image' : 'Uploading Image'}
              </h2>
              <p className="text-on-surface-variant text-sm leading-relaxed">{genMessage}</p>
            </div>

            {/* Preview if available */}
            {previewImage && (
              <div className="rounded-xl overflow-hidden border border-white/10">
                <img src={previewImage} alt="Generated exercise" className="w-full h-auto" />
              </div>
            )}

            <p className="text-on-surface-variant/50 text-xs italic">
              Please wait — do not close or refresh the page.
            </p>
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

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
          <textarea required name="executionSteps" rows={4} className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" placeholder={"Curl weight up\nSlow eccentric"}></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Trainer Insight</label>
          <textarea name="trainerInsight" rows={3} className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" placeholder="Do not swing your back."></textarea>
        </div>

        {/* AI Image Generation Toggle */}
        <div className="bg-surface-container-highest rounded-2xl p-5 border border-[#CCFF00]/10 space-y-4">
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={autoGenerate}
                onChange={(e) => setAutoGenerate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-surface-container-low rounded-full peer-checked:bg-[#CCFF00] transition-colors"></div>
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-6"></div>
            </div>
            <div className="flex-1">
              <span className="font-headline font-bold text-sm uppercase tracking-widest text-white flex items-center gap-2">
                <span>🤖</span> Auto-generate Image with Nano Banana AI
              </span>
              <p className="text-on-surface-variant text-xs mt-1">
                Uses Gemini AI to generate a wireframe exercise illustration matching the app&apos;s art style.
              </p>
            </div>
          </label>

          {/* Show status if generation happened */}
          {genStep === 'done' && generatedImageUrl && (
            <div className="bg-[#CCFF00]/10 rounded-xl p-3 border border-[#CCFF00]/20 flex items-center gap-3">
              <span className="text-[#CCFF00]">✅</span>
              <span className="text-[#CCFF00] text-xs font-bold uppercase tracking-widest">Image generated successfully</span>
            </div>
          )}

          {genStep === 'error' && (
            <div className="bg-error/10 rounded-xl p-3 border border-error/20 flex items-center gap-3">
              <span className="text-error text-sm">{genMessage}</span>
            </div>
          )}
        </div>

        {/* Manual Image URL — shown when auto-generate is OFF */}
        {!autoGenerate && (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Image URL (Manual)</label>
            <input name="imageUrl" type="text" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" placeholder="https://example.com/exercise.png" defaultValue={generatedImageUrl} />
          </div>
        )}

        {/* Hidden field for generated URL when auto-generate is ON */}
        {autoGenerate && (
          <input type="hidden" name="imageUrl" value={generatedImageUrl} />
        )}

        <button disabled={loading} type="submit" className="w-full bg-[#CCFF00] text-black font-headline font-black py-4 rounded-xl uppercase tracking-widest active:scale-95 transition-transform disabled:opacity-50 mt-8 flex items-center justify-center gap-3">
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {autoGenerate ? 'Generating & Saving...' : 'Saving...'}
            </>
          ) : (
            <>Save Exercise{autoGenerate && ' (with AI Image)'}</>
          )}
        </button>
      </form>
    </div>
  );
}
