import mongoose from 'mongoose';
import BannerAd from '@/models/BannerAd';
import Post from '@/models/Post';
import connectToDatabase from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MarketingDashboard() {
  await connectToDatabase();
  
  const banners = await BannerAd.find().sort({ createdAt: -1 }).lean();
  const posts = await Post.find().sort({ createdAt: -1 }).lean();
  
  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="font-headline font-black text-4xl uppercase text-white mb-2">Marketing Engine</h1>
        <p className="text-on-surface-variant font-medium">Control external communications and platform advertisements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Banner Ads Section */}
        <div className="bg-surface-container-low rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline font-bold text-xl uppercase tracking-widest text-white">Banner Ads</h2>
            <Link href="/admin/marketing/banners/new" className="bg-[#CCFF00] text-black px-4 py-2 rounded-full font-bold uppercase tracking-widest text-[10px] active:scale-95 transition-transform flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">add</span> New
            </Link>
          </div>
          
          <div className="space-y-4">
            {banners.length === 0 ? (
              <p className="text-on-surface-variant font-medium text-center py-8 text-sm">No active banners.</p>
            ) : (
              banners.map((ad: any) => (
                <div key={ad._id.toString()} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-highest border border-white/5">
                  <div className="flex items-center gap-3">
                    <img src={ad.imageUrl} className="w-16 h-10 object-cover rounded border border-white/10" />
                    <div>
                      <h4 className="font-bold text-white text-xs uppercase tracking-wider truncate w-32">{ad.title}</h4>
                      <span className={`text-[9px] font-bold uppercase tracking-widest ${ad.active ? 'text-[#CCFF00]' : 'text-error'}`}>
                        {ad.active ? 'Live' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Posts/Blogs Section */}
        <div className="bg-surface-container-low rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline font-bold text-xl uppercase tracking-widest text-white">Journal Posts</h2>
            <Link href="/admin/marketing/posts/new" className="bg-[#CCFF00] text-black px-4 py-2 rounded-full font-bold uppercase tracking-widest text-[10px] active:scale-95 transition-transform flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">add</span> New
            </Link>
          </div>
          
          <div className="space-y-4">
            {posts.length === 0 ? (
              <p className="text-on-surface-variant font-medium text-center py-8 text-sm">No journal entries.</p>
            ) : (
              posts.map((post: any) => (
                <div key={post._id.toString()} className="p-4 rounded-xl bg-surface-container-highest border border-white/5">
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-1">{post.title}</h4>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mb-2">{post.excerpt}</p>
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-surface-container-lowest px-2 py-1 rounded text-white/70">
                    {post.category}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
