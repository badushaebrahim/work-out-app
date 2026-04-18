import Link from "next/link";
import Header from "@/components/Header";

export default function ExpiredPage() {
  return (
    <main className="min-h-screen bg-surface flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 pt-24 pb-32">
        <div className="w-full max-w-lg">
          
          <div className="text-center mb-12">
            <div className="w-24 h-24 mx-auto bg-error/10 text-error rounded-full flex items-center justify-center mb-6 border border-error/20">
              <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>timer_off</span>
            </div>
            <h1 className="font-headline font-black text-4xl uppercase tracking-tighter text-white mb-4">
              Trial Expired
            </h1>
            <p className="text-on-surface-variant font-medium text-lg">
              Your trial has reached its limit. Upgrade to continue your journey.
            </p>
          </div>

          <div className="bg-surface-container-low rounded-[32px] p-8 space-y-8 mb-12 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
            
            <h2 className="font-headline font-bold text-xl uppercase tracking-widest text-[#CCFF00] mb-6 border-b border-white/10 pb-4">
              What you're missing
            </h2>

            <div className="space-y-6 relative z-10">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-tertiary mt-1">monitor_heart</span>
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">Advanced Biometrics</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Deep-dive into muscle recovery, sleep optimization, and HRV tracking.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="material-symbols-outlined text-tertiary mt-1">sports_kabaddi</span>
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">Pro Coaching</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Direct access to elite strength and conditioning coaches.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="material-symbols-outlined text-tertiary mt-1">restaurant</span>
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">Nutrition AI</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Personalized fueling plans synced to your output.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="material-symbols-outlined text-tertiary mt-1">public</span>
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">Global Community</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Join 50k+ athletes in high-performance squads.</p>
                </div>
              </div>
            </div>
          </div>

          <Link href="/upgrade" className="block w-full bg-gradient-to-r from-primary to-[#cafd00] text-black font-headline font-black py-5 rounded-full uppercase tracking-[0.2em] shadow-[0_10px_40px_rgba(202,253,0,0.2)] active:scale-95 transition-transform flex items-center justify-center gap-3 text-center">
            Upgrade Now
            <span className="material-symbols-outlined font-normal">bolt</span>
          </Link>

        </div>
      </div>
    </main>
  );
}
