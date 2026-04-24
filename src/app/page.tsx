import TrialTracker from '@/components/TrialTracker';
import CountdownClock from '@/components/CountdownClock';
import ShareButton from '@/components/ShareButton';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import Workout from '@/models/Workout';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';

// Force dynamic so it loads freshly from the DB
export const dynamic = 'force-dynamic';

const categoryImages: Record<string, string> = {
  BICEPS: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqqMtxEoBlL4_jSyYgeXoX4MB4saGLieRIhaJqDS8RyNKdHNAdaQYn8EDcGC_f3PLbeg94Y5zDGesu3mcJX6g0b6by9yk24VhyFg8otOoxgbkZzlCM_hnHUsTwSiCbxuJMQnH3w9jo75batkTOPwGjS2HT827l4XaOKdzqHmIi3YEBFDc9yYjcYq77lgYmkwP22ifu1I92cNOF_ydKdfagwmKyfu2-3_g7lwQGXkpGIi275p3NXVhem-CtxSNGs8ji8HXi5sSL8EE',
  TRICEPS: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBptWb0A3VLl5S2YfklQvYQSgxx0OLtpkooX1VqXMuzU3in38ZIBQDgvJwy3oQTP_ZOywVWX7oJg4kM60S02lPSbgwvuyXP69y26XzfjEShYb0wWRoGYHbSxZEJDIeKBOlTqQjOzlXXMd7JH7s3naFi8T4vbBUkfcuONTlMzFXMAGNSLQls7Ny0puSr53bGmKPT3LsljKDgdgHjdyqlUI1fagO78rddJKjdoAOScgABIAhujMt5N78x_HxUg3TbmMmvuN0fIbhIwrE',
  BACK: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7qYm3FfSxS-uVwVjpM4ifIhX3x7RrVk8lC8BtoM3pDR_JQs6bk7hqM0K9WTMQlSXx12bXn4ydtJXiHuPOkZTLcUkDE_POTrVExE7amKJDdxp_dM8AG7tPy_kv8Kilz6x-5AYtYZXx5crUymVNqzt0OX6t9lmdhnhtmsO04Rx-MqQstKln-EVtLpmSvb3LInhhwzTKIWn-d9KwGJUj3orsoKVx3R6wC8mThrs06n6FLgF7WAEFOwVmputNg7EzfVmSsZegUmiF0xA',
  LEGS: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDakohgWd7wPq668mOSEr8maUGhLcbMgIyxY_D29CL-RLUH9VRGKiygMuuBlvulFp6a8IKjBz9jV-pHVVJiotUFs-x3NmDn4zUJm1SE7zhCj0rthQfobDwNkE7N-H69jZhiqF8ssRrH__maiVMJzJWFnYUH2GsREhJiQscgc1xezNkN71GCuobPnhCR5o6LwiY0YqB07CDDZVGeUBWC38adUWM01cQYYzPXWbny_8W4wYDQUviWuxOSiIaGWie0gkIAzicuDGkOi1w',
  SHOULDERS: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnENpLzI_BqwDq_sVSlppsUSwHQyHLV1vYgVvpTfALEUffkkQMUZppECjD1Mm8gKAjoBUwLUXXNwxIZ3d52GRUzIfhUH2kcw5cUDBAb6kQ689D2CtqgBNs6muLhbnqaujoxUHxd6sZntQoOcTZpkNpKaF1yvGKEGYR8OLV29SFy67_xB3CTBJ1o6ft9x3zoK0mfwgZc3OuDGh-Fbfj--aVomdi3PKhdes0DfDlf6yyEH-bCpzP10dTZJ2wI3IplH2UIS2stQA0Rms',
  MIX: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9vf5Na2jl4Bj81uUSwe9FXyb0GJM31np6p6zud7H99_GTFBHXbEWphwsYQIrkHyVVGEOruTzQU-sUOQSpUgDOm8TZcFenTdjjebtoqG8czP4DoBPcIxP_DwB83xtP2AHez1ZGxN7gWoyOcORhD043eRbgBwXeoJkxpWBKpMj2YntYvqutQAJpgkb_3rx2mWIopUOWTUc4ts-tt4n1rp3zt2iTLNfHdVfb1tWFMj24PkMuRzBtjznhTM3LX4t0o8QGwrgYas4L9mw',
};
const defaultImg = 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500';

export default async function Dashboard() {
  // Check User Premium Status
  let isPremium = false;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;
    if (token) {
      const payload = await verifyJwt(token);
      if (payload && (payload.role === 'premium' || payload.role === 'admin')) {
        isPremium = true;
      }
    }
  } catch (e) {}

  // Connect to DB via wrapper
  await connectToDatabase();

  let dbCategories: string[] = [];
  let basicCategories: string[] = [];
  try {
    dbCategories = await Workout.distinct('categories') || [];
    basicCategories = await Workout.distinct('categories', { tier: 'basic' }) || [];
  } catch (e) {
    console.error("DB Error", e);
  }

  // Filter out any empty strings or nulls and format them
  const validCategories = dbCategories
    .filter(c => c && typeof c === 'string' && c.trim().length > 0)
    .map(c => c.toUpperCase());
    
  // Deduplicate case-insensitive categories
  const uniqueCategories = Array.from(new Set(validCategories));
  const basicSet = new Set(basicCategories.filter(c => c && typeof c === 'string').map(c => c.toUpperCase()));

  const tiles = uniqueCategories.map(cat => {
    const isPremiumOnly = !basicSet.has(cat);
    const isLocked = !isPremium && isPremiumOnly;
    
    return {
      title: cat,
      href: isLocked ? '/upgrade' : `/workouts?focus=${encodeURIComponent(cat)}`,
      img: categoryImages[cat] || defaultImg,
      isLocked
    };
  });

  return (
    <main className="pt-20 px-6 space-y-8">
      <TrialTracker />
      {/* Premium Admin Banner */}
      {/* <section className="relative w-full h-[420px] rounded-full overflow-hidden flex items-end p-8 group">
        <img
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt="dramatic wide shot of a high-end luxury gym interior with dark obsidian walls and neon accent lighting"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuArRtB3xl9qAjD8dkwn6FpUsYM4SG4EKzaKcvXaLK3N4Vyw1uT4A2OdLqsBTw1Ox6ywA0IcBbSNqjgcUlY7FgAFadk4aL1HF_s2-nu74cwMrvqrlHF0MDKMdCDdgSrxHX4-TiHePCOM4xDogKrqrJieJR6_wDhEYfn8qyYHPOmGF9Yn9d3pc1-UDtIRlfLSIGdmb-fzilrBEuH_XiKauWOmYzQi01u4fk0VnAgTIyThBSE8aPk0nVZe-WC63OUfOqVFVB5VD9ZwQdY"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        <div className="relative z-10 max-w-lg space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary/20 backdrop-blur-md border border-tertiary/30">
            <span
              className="material-symbols-outlined text-tertiary text-sm mr-2"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              workspace_premium
            </span>
            <span className="text-tertiary font-label text-[10px] font-bold tracking-[0.2em] uppercase">
              Elite Event
            </span>
          </div>
          <h1 className="font-headline text-5xl font-black italic tracking-tighter text-white leading-none">
            THE MIDNIGHT<br />PULSE SESSION
          </h1>
          <p className="text-on-surface-variant font-body text-sm max-w-xs">
            Join the world's most exclusive HIIT event this Friday. Limited slots available for Buddy Elite members.
          </p>
          <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold px-8 py-3 rounded-full uppercase tracking-widest text-xs active:scale-90 transition-transform shadow-[0_0_40px_rgba(202,253,0,0.2)]">
            Reserve Now
          </button>
        </div>
      </section> */}

      {/* Workout Refresh Countdown */}
      <section className="flex flex-col items-center py-6">
        <h3 className="font-label text-[10px] text-on-surface-variant font-extrabold tracking-[0.4em] uppercase mb-4">
          Workout Refresh In
        </h3>
        <CountdownClock />
      </section>

      {/* Target Zones Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-headline text-2xl font-black tracking-tighter uppercase text-white">Target Zones</h2>
            <p className="text-on-surface-variant font-body text-xs">Body part specific sessions</p>
          </div>
          <a href="/workouts?focus=All" className="text-primary font-label text-[10px] font-bold tracking-widest uppercase border-b-2 border-primary pb-1">
            See All
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {tiles.length > 0 ? tiles.map((tile) => (
            <a key={tile.title} href={tile.href} className={`bg-surface-container rounded-3xl overflow-hidden flex flex-col active:scale-[0.98] transition-all relative ${tile.isLocked ? 'opacity-60 grayscale' : ''}`}>
              <div className="relative aspect-square">
                <img alt={`${tile.title} workout`} className="w-full h-full object-cover" src={tile.img} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                
                {tile.isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface/80 p-3 rounded-full text-white shadow-lg flex items-center justify-center border border-white/10">
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <h4 className="font-headline text-sm font-black uppercase italic text-white">{tile.title}</h4>
                  {tile.isLocked && <span className="text-[8px] font-black uppercase tracking-widest bg-tertiary text-on-tertiary-fixed px-1.5 py-0.5 rounded">ELITE</span>}
                </div>
              </div>
            </a>
          )) : (
            <div className="col-span-2 text-center py-4 text-on-surface-variant font-label text-xs uppercase tracking-widest">
              No categories found
            </div>
          )}
        </div>
      </section>

      {/* Fitness News Horizontal Scroll */}
      <section className="space-y-4 pb-12">
        <div className="flex justify-between items-center">
          <h2 className="font-headline text-xl font-black tracking-tighter uppercase">Buddy Feed</h2>
          <span className="material-symbols-outlined text-on-surface-variant">arrow_forward</span>
        </div>
        <div className="flex overflow-x-auto gap-4 no-scrollbar -mx-6 px-6">
          {/* News Card 1 */}
          <div className="flex-shrink-0 w-72 space-y-3">
            <div className="h-40 w-full rounded-xl overflow-hidden relative">
              <img
                className="w-full h-full object-cover"
                alt="aesthetic close-up of healthy meal prep with grilled salmon and greens in a dark minimalist setting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtJziSoqnWuXL54F2ELUR3VC0lwGiAwKz2XLePJvC2fFOtPh6YD_TtQ5n5L_qtrwPl0MXpHuJrnvx7s_VAl2FlM-sHGuXWIRjqja9931XfLP5hY97HRjYub9i0K_laJIXcDLQ3q0BJW3cOd0C0Xj0iKmqGFrZe-YAZRK2lQy3Q2KmF7xbeio1BoxlWCPx5t41kJNS_hzG4F8bW5IwcFUxKEP9KC3OqhS8zFD04AbUN3RNRLpCXwu-y0vFBMmA1qK8d8y9ChorxlnQ"
              />
              <div className="absolute top-3 left-3 glass-card px-2 py-1 rounded text-[8px] font-black text-white uppercase tracking-widest">
                Nutrition
              </div>
            </div>
            <h5 className="font-headline text-sm font-bold leading-tight line-clamp-2">
              WHY HYPER-HYDRATION IS THE NEW FRONTIER FOR RECOVERY
            </h5>
            <p className="font-label text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">
              4 MIN READ
            </p>
          </div>

          {/* News Card 2 */}
          <div className="flex-shrink-0 w-72 space-y-3">
            <div className="h-40 w-full rounded-xl overflow-hidden relative">
              <img
                className="w-full h-full object-cover"
                alt="close-up of biometric sensor on an athlete's wrist glowing green in a dark environment"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZ0R_gsud97lKnO4_FUJB6j0Xyu4QHFoZNwNi-Ul2bZRnlXqgYxnJS-uwKyOsp_Fhoj6PnaDYNz2BvzzGd92Gx_XW57v5VcShzdKO_79Vw-nJVySf1smAjD0aYqEPndZTEXeQDeI4D93ravVbX1jtSuFEW-oQaJcWxKx1-Ab9h9GHHGz6-mzWJ5jqBA6QroMynQpW04GghQ3sdj8nQYccveAUC2bLAO5MRgRWwcGrMS6jx6eCwxWjD5x9GtPK7h7rVP5KJadeNq_I"
              />
              <div className="absolute top-3 left-3 glass-card px-2 py-1 rounded text-[8px] font-black text-white uppercase tracking-widest">
                Gear
              </div>
            </div>
            <h5 className="font-headline text-sm font-bold leading-tight line-clamp-2">
              NEXT-GEN BIOMETRICS: BEYOND THE HEART RATE TRACKER
            </h5>
            <p className="font-label text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">
              7 MIN READ
            </p>
          </div>

          {/* News Card 3 */}
          <div className="flex-shrink-0 w-72 space-y-3">
            <div className="h-40 w-full rounded-xl overflow-hidden relative">
              <img
                className="w-full h-full object-cover"
                alt="silhouette of a person practicing yoga against a dark window with city lights in the distance"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqYQAyAMXMX2djBs77JG8iDF0Opz6T0gsRS714maqZ1A81wOFLwmi5Tv_MbaHdZ_Nrh0e3QJeieylIy3aJ8FnuMtGs89Sr9cpEji_HfHz4W0oCORbT8gHVPXSR4o4L3bxgzsxsMOLwir6ej8l6SCS-aw1jsc0NDETfEk-orpQCuKYcAQkyE4Eg86-JisFfdnGj9CHKlsH1QFi9JDSJTeFlc6uMUsAZ_Z2WnspttfjjzJqNImIdYRLmjRzDtYVGGlQ0wsTKWfEUcyY"
              />
              <div className="absolute top-3 left-3 glass-card px-2 py-1 rounded text-[8px] font-black text-white uppercase tracking-widest">
                Mindset
              </div>
            </div>
            <h5 className="font-headline text-sm font-bold leading-tight line-clamp-2">
              THE PSYCHOLOGY OF PEAK PERFORMANCE AT 5 AM
            </h5>
            <p className="font-label text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">
              5 MIN READ
            </p>
          </div>
        </div>
      </section>

      {/* Contextual FAB for sharing the link */}
      <ShareButton />
    </main>
  );
}
