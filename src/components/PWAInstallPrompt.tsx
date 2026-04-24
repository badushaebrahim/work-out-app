'use client';

import { useEffect, useState } from 'react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed in this session or installed
    const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show the banner after a short delay to feel "post-login" subtle
      setTimeout(() => setVisible(true), 2500);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem('pwa-prompt-dismissed', '1');
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-24 left-4 right-4 z-[9999] max-w-sm mx-auto"
      style={{ animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div className="bg-surface-container-high backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex items-center gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-[#CCFF00]/10 border border-[#CCFF00]/20 flex items-center justify-center shrink-0">
          <img src="/icon-192.png" alt="App Icon" className="w-8 h-8 rounded-lg object-cover" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm uppercase tracking-wider leading-tight">Add to Home Screen</p>
          <p className="text-on-surface-variant text-[11px] mt-0.5">Install Buddy Elite for quick access</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-surface-container transition-colors"
            aria-label="Dismiss"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
          <button
            onClick={handleInstall}
            className="bg-[#CCFF00] text-black text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full active:scale-95 transition-transform hover:shadow-[0_0_20px_rgba(204,255,0,0.4)]"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
