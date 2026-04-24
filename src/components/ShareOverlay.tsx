'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

interface ShareOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareOverlay({ isOpen, onClose }: ShareOverlayProps) {
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentUrl(window.location.origin); // or window.location.href if you want the exact path
    }
  }, []);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Buddy',
          text: 'Check out this amazing fitness app!',
          url: currentUrl,
        });
      } catch (err) {
        console.error('Error sharing: ', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md">
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-surface border border-outline-variant/10 rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.8)] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 text-on-surface-variant hover:text-on-surface transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>
        
        <div className="p-8 md:p-10 flex flex-col items-center text-center">
          {/* Header */}
          <h1 className="font-display font-black text-4xl uppercase tracking-tighter text-on-surface mb-2">
            Invite a Buddy
          </h1>
          <p className="text-on-surface-variant font-body mb-8 max-w-[280px]">
            Expand your squad and dominate the obsidian floor together.
          </p>
          
          {/* QR Area */}
          <div className="bg-gradient-to-br from-[#191a1a] to-[#000000] p-6 rounded-3xl border border-outline-variant/20 mb-8 flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative w-48 h-48 bg-white p-2 rounded-xl flex items-center justify-center">
              {currentUrl ? (
                <QRCode
                  value={currentUrl}
                  size={176} // 176px fits within the 192px (w-48) minus padding
                  style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                  viewBox={`0 0 176 176`}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
              )}
            </div>
          </div>
          
          {/* Copy Link Button */}
          <button
            onClick={handleCopy}
            className="w-full py-5 px-8 rounded-full bg-gradient-to-br from-[#f3ffca] to-[#cafd00] text-black font-display font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(204,255,0,0.3)] mb-10"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              {copied ? 'check' : 'link'}
            </span>
            {copied ? 'Link Copied!' : 'Copy Unique Link'}
          </button>
          
          {/* Social Share Row */}
          <div className="flex items-center justify-center gap-6 mb-10">
            <button className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-surface-bright transition-colors active:scale-90">
              <span className="material-symbols-outlined text-2xl text-on-surface">chat_bubble</span>
            </button>
            <button className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-surface-bright transition-colors active:scale-90">
              <span className="material-symbols-outlined text-2xl text-on-surface">photo_camera</span>
            </button>
            <button 
              onClick={handleShare}
              className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-surface-bright transition-colors active:scale-90"
            >
              <span className="material-symbols-outlined text-2xl text-on-surface">ios_share</span>
            </button>
            <button className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-surface-bright transition-colors active:scale-90">
              <span className="material-symbols-outlined text-2xl text-on-surface">mail</span>
            </button>
          </div>
          
          {/* Referral Perk Card */}
          <div className="w-full p-6 bg-surface-container-lowest border border-outline-variant/15 rounded-3xl flex items-center gap-4 text-left">
            <div className="bg-tertiary-container/20 p-3 rounded-full">
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                workspace_premium
              </span>
            </div>
            <div>
              <p className="text-tertiary font-display font-bold uppercase text-xs tracking-widest">Premium Reward</p>
              <p className="text-on-surface font-body text-sm">Get 1 month ELITE for every successful referral.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
