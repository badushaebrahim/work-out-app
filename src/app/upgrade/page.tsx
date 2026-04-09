import Link from 'next/link';

export default function UpgradePage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pt-24 pb-32 relative overflow-hidden">

      {/* Background aesthetics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-[400px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
      </div>

      <div className="relative z-10 max-w-lg w-full">
        <div className="bg-surface-container-low rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">

          <div className="bg-gradient-to-br from-tertiary/20 via-surface-container-low to-surface-container-low p-8 text-center border-b border-white/5">
            <span className="material-symbols-outlined text-[60px] text-tertiary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            <h1 className="font-headline font-black text-4xl uppercase tracking-tighter text-white mb-2 italic">Upgrade Required</h1>
            <p className="text-on-surface-variant font-medium text-sm">You've hit the limit. Only Kinetic Elite members can proceed past this point.</p>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-tertiary">check_circle</span>
                <span className="font-bold text-sm uppercase tracking-widest text-white">Full Library Access</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-tertiary">check_circle</span>
                <span className="font-bold text-sm uppercase tracking-widest text-white">Advanced Hypertrophy</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-tertiary">check_circle</span>
                <span className="font-bold text-sm uppercase tracking-widest text-white">Direct Coach Insights</span>
              </div>
            </div>

            <div className="bg-surface-container-highest rounded-2xl p-6 border border-tertiary/20 text-center">
              <h3 className="font-label font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-2">Premium Subscription</h3>
              <div className="flex justify-center items-end gap-1 mb-1">
                <span className="font-bold text-xl text-white">QR</span>
                <span className="font-headline text-5xl font-black text-white leading-none">20</span>
                <span className="font-bold text-on-surface-variant">/mo</span>
              </div>
            </div>

            <button disabled className="w-full bg-gradient-to-r from-tertiary to-tertiary-dim text-black font-headline font-black py-5 rounded-full uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(255,221,121,0.2)] hover:opacity-90 active:scale-95 transition-all outline-none">
              Checkout Setup Pending
            </button>
            <p className="text-center text-xs text-on-surface-variant italic mt-4">Stripe API configuration waiting on credentials.</p>
          </div>

        </div>

        <div className="mt-8 text-center">
          <Link href="/workouts" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Return to Basic Tier
          </Link>
        </div>
      </div>
    </main>
  );
}
