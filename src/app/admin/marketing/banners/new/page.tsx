"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { createBannerAd } from "@/app/admin/actions";

export default function NewBannerAdPage() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-headline font-black text-3xl uppercase tracking-widest text-[#CCFF00] mb-2">New Campaign</h1>
        <p className="text-on-surface-variant font-medium">Activate a new sponsorship or internal promo banner.</p>
      </div>

      <form action={async (formData) => {
        setLoading(true);
        if (imageUrl) formData.append('imageUrl', imageUrl);
        await createBannerAd(formData);
      }} className="space-y-6">
        
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Campaign Title</label>
          <input required name="title" type="text" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" placeholder="e.g. Optimum Nutrition Spring Sale" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Redirect URL</label>
          <input required name="redirectUrl" type="url" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" placeholder="https://..." />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Banner Graphic (16:9 Recommended)</label>
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
                  button: "bg-white text-black font-bold uppercase tracking-widest text-xs py-2 px-6 rounded-full after:bg-white",
                  label: "text-on-surface-variant",
                  allowedContent: "text-on-surface-variant/50"
                }}
              />
            </div>
          )}
        </div>

        <button disabled={loading || !imageUrl} type="submit" className="w-full bg-white text-black font-headline font-black py-4 rounded-xl uppercase tracking-widest active:scale-95 transition-transform disabled:opacity-50 mt-8">
          {loading ? "Activating..." : "Go Live"}
        </button>
      </form>
    </div>
  );
}
