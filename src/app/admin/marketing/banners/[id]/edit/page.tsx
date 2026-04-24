import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import BannerAd from "@/models/BannerAd";
import { updateBannerAd } from "@/app/admin/actions";
import { notFound } from "next/navigation";

export default async function EditBannerAdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  await connectToDatabase();

  const ad = await BannerAd.findById(id).lean();
  if (!ad) notFound();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-headline font-black text-3xl uppercase tracking-widest text-[#CCFF00] mb-2">Modify Campaign</h1>
        <p className="text-on-surface-variant font-medium">Update the specifics of {ad.title}</p>
      </div>

      <form action={async (formData) => {
        'use server';
        await updateBannerAd(id, formData);
      }} className="space-y-6">
        
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Campaign Title</label>
          <input defaultValue={ad.title} required name="title" type="text" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Redirect URL</label>
          <input defaultValue={ad.redirectUrl} required name="redirectUrl" type="url" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Current Media URL (Paste new string to change)</label>
          <input defaultValue={ad.imageUrl} required name="imageUrl" type="url" className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-white placeholder:text-outline focus:ring-1 focus:ring-[#CCFF00]/30 outline-none" />
          <div className="mt-2 rounded-xl overflow-hidden relative h-48 border border-white/5 opacity-50 block">
             <img src={ad.imageUrl} className="w-full h-full object-cover" />
          </div>
        </div>

        <button type="submit" className="w-full bg-[#CCFF00] text-black font-headline font-black py-4 rounded-xl uppercase tracking-widest active:scale-95 transition-transform mt-8">
          Save Changes
        </button>
      </form>
    </div>
  );
}
