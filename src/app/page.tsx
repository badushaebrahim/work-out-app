import TrialTracker from '@/components/TrialTracker';
import CountdownClock from '@/components/CountdownClock';
export default function Dashboard() {
  return (
    <main className="pt-20 px-6 space-y-8">
      <TrialTracker />
      {/* Premium Admin Banner */}
      <section className="relative w-full h-[420px] rounded-full overflow-hidden flex items-end p-8 group">
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
            Join the world's most exclusive HIIT event this Friday. Limited slots available for Kinetic Elite members.
          </p>
          <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold px-8 py-3 rounded-full uppercase tracking-widest text-xs active:scale-90 transition-transform shadow-[0_0_40px_rgba(202,253,0,0.2)]">
            Reserve Now
          </button>
        </div>
      </section>

      {/* Workout Refresh Countdown */}
      <section className="flex flex-col items-center py-6">
        <h3 className="font-label text-[10px] text-on-surface-variant font-extrabold tracking-[0.4em] uppercase mb-4">
          Workout Refresh In
        </h3>
        <CountdownClock />
      </section>

      {/* Today's Recommended Workout */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-headline text-2xl font-black tracking-tighter uppercase">Daily Recommendation</h2>
            <p className="text-on-surface-variant font-body text-xs">Based on your recent recovery data.</p>
          </div>
          <span className="text-primary font-label text-[10px] font-bold tracking-widest uppercase border-b-2 border-primary pb-1">
            View Plan
          </span>
        </div>
        <div className="bg-surface-container-high rounded-[2rem] overflow-hidden p-1 flex flex-col md:flex-row gap-1">
          <div className="relative h-64 md:h-auto md:w-1/2 rounded-[1.8rem] overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt="heavy medicine ball on a dark rubber gym floor with cinematic low key lighting and dust particles"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8FxLNxJOn_e7ER2L7ogVzwhJfXIip3odiUUWzpqSLrlQkOkVj0C73ctcjB-sYvMT0Ksji-5_lcvo1yw_LoQdjg6Ej5ktUwfywfa7PCr6AqlU8seTrNdF48QGiAlBXKp5qhyAf8zYfj0SjyiC2l65CQpgjIC1nppX4_nwq9H5RemIQq-z61M6wDVXHc5grClNmI7BKMhUCS7B_LCERhHHK-9djL4iOfRiHmtXLLMiOqLWG0pS4Z5lcbs1pEpOzZ7jW4jBL2kwu_hI"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-highest/80 to-transparent"></div>
            <div className="absolute bottom-6 left-6">
              <div className="bg-primary/20 backdrop-blur-md px-3 py-1 rounded-full inline-block border border-primary/30 mb-2">
                <span className="text-primary font-label text-[10px] font-black uppercase tracking-widest">
                  Advanced
                </span>
              </div>
              <h4 className="font-headline text-xl font-bold text-white uppercase italic tracking-tight">
                Valkyrie Protocol
              </h4>
            </div>
          </div>
          <div className="md:w-1/2 p-8 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-on-surface-variant text-[10px] font-bold tracking-widest uppercase">Duration</p>
                <p className="font-headline text-2xl font-bold text-white tracking-tighter">
                  45<span className="text-xs ml-1 text-on-surface-variant">MIN</span>
                </p>
              </div>
              <div>
                <p className="text-on-surface-variant text-[10px] font-bold tracking-widest uppercase">Target</p>
                <p className="font-headline text-2xl font-bold text-white tracking-tighter">
                  CO<span className="text-xs ml-1 text-on-surface-variant">RE</span>
                </p>
              </div>
              <div>
                <p className="text-on-surface-variant text-[10px] font-bold tracking-widest uppercase">Est. Burn</p>
                <p className="font-headline text-2xl font-bold text-primary tracking-tighter">
                  620<span className="text-xs ml-1 text-on-surface-variant">KCAL</span>
                </p>
              </div>
              <div>
                <p className="text-on-surface-variant text-[10px] font-bold tracking-widest uppercase">Intensity</p>
                <div className="flex gap-1 mt-2">
                  <div className="w-4 h-1 bg-primary rounded-full"></div>
                  <div className="w-4 h-1 bg-primary rounded-full"></div>
                  <div className="w-4 h-1 bg-primary rounded-full"></div>
                  <div className="w-4 h-1 bg-outline-variant rounded-full"></div>
                </div>
              </div>
            </div>
            <button className="w-full mt-8 bg-surface-bright text-white font-bold py-4 rounded-full uppercase tracking-[0.2em] text-[10px] border border-white/5 active:scale-95 transition-transform">
              Start Training Session
            </button>
          </div>
        </div>
      </section>

      {/* Fitness News Horizontal Scroll */}
      <section className="space-y-4 pb-12">
        <div className="flex justify-between items-center">
          <h2 className="font-headline text-xl font-black tracking-tighter uppercase">Kinetic Feed</h2>
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

      {/* Contextual FAB */}
      {/* <button className="fixed right-6 bottom-24 bg-primary text-on-primary w-14 h-14 rounded-full shadow-[0_10px_30px_rgba(202,253,0,0.4)] flex items-center justify-center active:scale-90 transition-transform z-40">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          add
        </span>
      </button> */}
    </main>
  );
}
