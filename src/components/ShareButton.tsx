'use client';

import React, { useState } from 'react';
import ShareOverlay from './ShareOverlay';

export default function ShareButton() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  return (
    <>
      {/* Contextual FAB for sharing */}
      <button 
        onClick={() => setIsOverlayOpen(true)}
        className="fixed right-6 bottom-24 bg-gradient-to-br from-primary to-primary-container text-black w-14 h-14 rounded-full shadow-[0_10px_30px_rgba(202,253,0,0.4)] flex items-center justify-center active:scale-90 transition-transform z-40"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          share
        </span>
      </button>

      {/* The Overlay */}
      <ShareOverlay 
        isOpen={isOverlayOpen} 
        onClose={() => setIsOverlayOpen(false)} 
      />
    </>
  );
}
