"use client";

import { useState } from "react";

export default function ExerciseAccordion({ exercise, index }: { exercise: any; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen ? (
        <div 
          onClick={() => setIsOpen(true)}
          className="bg-surface-container-low rounded-xl p-5 flex justify-between items-center transition-all hover:bg-surface-container active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary">fitness_center</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm tracking-tight text-white uppercase">{exercise.name}</h3>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider">{exercise.type}</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
        </div>
      ) : (
        <div className="bg-surface-container-low rounded-[2rem] overflow-hidden border border-primary/10 shadow-2xl">
          <div 
            onClick={() => setIsOpen(false)}
            className="p-6 flex justify-between items-start cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container">fitness_center</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg tracking-tighter text-primary uppercase">{exercise.name}</h3>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">{exercise.type}</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-primary">expand_less</span>
          </div>

          <div className="px-4">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-surface-container-lowest border border-outline-variant/30">
              <img className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzWds04ADazJZPF1uKxk92fR82VdSbheE9wUgMCaWdlxCZWkPFRUDi0jKrZ3astlnUAsOTNIVc-C92OoiAsKmDCO1n7lUMTwsXHYPEexOSVNAUaw7d0QyyW5xWJhHzq4CnDkIHCr_A35I94H34HjDem0bAyETeKSe1N4H2SHnERnIFo0x4ZDw8c2ADirBbqx1hcsf-dEHPPnTQG72btD9vIkf4XGjCGv7OL-f2zGczzwdmjIlC_UCAQM3Do605saNA4ZZHavJpddk" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/40">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 flex justify-between gap-2">
                <div className="flex-1 bg-surface-variant/40 backdrop-blur-xl rounded-xl p-3 border border-white/5 text-center">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Sets</p>
                  <p className="font-headline text-lg font-black text-primary">{exercise.sets}</p>
                </div>
                <div className="flex-1 bg-surface-variant/40 backdrop-blur-xl rounded-xl p-3 border border-white/5 text-center">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Reps</p>
                  <p className="font-headline text-lg font-black text-primary">{exercise.reps}</p>
                </div>
                <div className="flex-1 bg-surface-variant/40 backdrop-blur-xl rounded-xl p-3 border border-white/5 text-center">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Rest</p>
                  <p className="font-headline text-lg font-black text-primary">{exercise.rest}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full"></span> Execution Guide
              </h4>
              <ol className="space-y-4">
                {exercise.executionSteps?.map((step: string, sIdx: number) => (
                  <li key={sIdx} className="flex gap-4">
                    <span className="font-headline font-black text-primary/30 text-2xl leading-none">{(sIdx + 1).toString().padStart(2, '0')}</span>
                    <p className="text-sm text-on-surface leading-relaxed pt-1 flex-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {exercise.trainerInsight && (
              <div className="bg-tertiary/10 border-l-4 border-tertiary rounded-r-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-tertiary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <p className="text-[10px] font-black uppercase tracking-widest text-tertiary">Trainer's Elite Insight</p>
                </div>
                <p className="text-xs text-tertiary-fixed leading-relaxed italic">"{exercise.trainerInsight}"</p>
              </div>
            )}
            
            <button className="w-full py-4 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-headline font-black uppercase tracking-widest text-sm shadow-[0_10px_30px_rgba(243,255,202,0.2)] active:scale-95 transition-all">
                LOG FIRST SET
            </button>
          </div>
        </div>
      )}
    </>
  );
}
