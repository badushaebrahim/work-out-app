'use client';

import { useState, useEffect } from 'react';
import { saveHubMetrics } from './actions';
import { useRouter } from 'next/navigation';

export default function HubCalculators({ isPremium, initialMetrics }: { isPremium: boolean, initialMetrics: any }) {
  const router = useRouter();
  
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'Male'|'Female'>('Male');
  const [weight, setWeight] = useState<number>(80); // kg
  const [height, setHeight] = useState<number>(180); // cm
  const [waist, setWaist] = useState<number>(80); // cm
  const [neck, setNeck] = useState<number>(38); // cm
  const [activity, setActivity] = useState<number>(1.55); // moderate base
  
  const [bmi, setBmi] = useState<number>(initialMetrics.bmi || 0);
  const [bodyFat, setBodyFat] = useState<number>(initialMetrics.bodyFat || 0);
  const [calories, setCalories] = useState<number>(initialMetrics.dailyCalories || 0);

  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    // Whenever inputs change, recalculate values dynamically without saving
    if (weight > 0 && height > 0) {
      // 1. Calculate BMI
      const heightInMeters = height / 100;
      const calcBmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
      setBmi(calcBmi);
      
      // 2. Calculate Body Fat (US Navy Method based formulas)
      let calcFat = 0;
      if (waist > neck) {
        if (gender === 'Male') {
          calcFat = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
        } else {
          calcFat = 163.205 * Math.log10(waist - neck) - 97.684 * Math.log10(height) + 78.387;
        }
      }
      calcFat = Math.max(2, parseFloat(calcFat.toFixed(1))); // Cap lowest at 2% internally
      setBodyFat(calcFat);
      
      // 3. Calculate Calories (Mifflin-St Jeor TDEE)
      let bmr = (10 * weight) + (6.25 * height) - (5 * age);
      bmr = gender === 'Male' ? bmr + 5 : bmr - 161;
      const tdee = Math.round(bmr * activity);
      setCalories(tdee);
    }
  }, [age, gender, weight, height, activity, waist, neck]);

  const handleSaveAll = async () => {
    if (!isPremium) {
      setMessage({ text: 'Upgrade to Elite to save metrics to your profile!', type: 'error' });
      return;
    }
    
    setMessage(null);
    const result = await saveHubMetrics({ bmi, bodyFat, dailyCalories: calories });
    
    if (result.success) {
      setMessage({ text: 'Metrics successfully synced to your profile!', type: 'success' });
    } else {
      setMessage({ text: result.error || 'Failed to sync.', type: 'error' });
    }
  };

  return (
    <div className="space-y-8">
      {message && (
        <div className={`p-4 rounded-xl text-center text-sm font-bold tracking-wide uppercase ${message.type === 'success' ? 'bg-[#cae252]/20 text-[#f3ffca] border border-[#cae252]/50' : 'bg-red-500/20 text-red-200 border border-red-500/50'}`}>
          {message.text}
          {message.type === 'error' && !isPremium && (
            <button onClick={() => router.push('/upgrade')} className="block w-full mt-3 bg-red-500 text-white py-2 rounded-lg text-xs">GO PREMIUM</button>
          )}
        </div>
      )}

      {/* Input Form Master */}
      <div className="bg-surface-container rounded-3xl p-6 border border-white/5 space-y-5">
        <h2 className="font-headline font-black uppercase text-xl text-white tracking-tight border-b border-white/10 pb-4">Personal Data</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Gender</label>
            <select aria-label="Gender select" className="w-full bg-surface-container-highest rounded-lg p-3 text-white text-sm outline-none border border-transparent focus:border-primary/50" value={gender} onChange={(e) => setGender(e.target.value as any)}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Age</label>
            <input type="number" className="w-full bg-surface-container-highest rounded-lg p-3 text-white text-sm outline-none border border-transparent focus:border-primary/50" value={age} onChange={(e) => setAge(Number(e.target.value))} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Weight (kg)</label>
            <input type="number" className="w-full bg-surface-container-highest rounded-lg p-3 text-white text-sm outline-none border border-transparent focus:border-primary/50" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Height (cm)</label>
            <input type="number" className="w-full bg-surface-container-highest rounded-lg p-3 text-white text-sm outline-none border border-transparent focus:border-primary/50" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Waist (cm)</label>
            <input type="number" className="w-full bg-surface-container-highest rounded-lg p-3 text-white text-sm outline-none border border-transparent focus:border-primary/50" value={waist} onChange={(e) => setWaist(Number(e.target.value))} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Neck (cm)</label>
            <input type="number" className="w-full bg-surface-container-highest rounded-lg p-3 text-white text-sm outline-none border border-transparent focus:border-primary/50" value={neck} onChange={(e) => setNeck(Number(e.target.value))} />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Activity Level</label>
          <select aria-label="Activity Level select" className="w-full bg-surface-container-highest rounded-lg p-3 text-white text-sm outline-none border border-transparent focus:border-primary/50" value={activity} onChange={(e) => setActivity(Number(e.target.value))}>
            <option value={1.2}>Sedentary (Office Job)</option>
            <option value={1.375}>Light Exercise (1-2 days/wk)</option>
            <option value={1.55}>Moderate Exercise (3-5 days/wk)</option>
            <option value={1.725}>Heavy Exercise (6-7 days/wk)</option>
            <option value={1.9}>Athlete (2x per day)</option>
          </select>
        </div>
      </div>

      {/* Tiles Output */}
      <h2 className="font-headline font-black uppercase text-xl text-white tracking-tight pt-4">Calculations</h2>
      <div className="grid grid-cols-1 gap-4">
        
        {/* BMI Tile */}
        <div className="bg-gradient-to-br from-surface-container-low to-surface-container p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <span className="material-symbols-outlined text-8xl">accessibility_new</span>
            </div>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.2em] relative z-10">Body Mass Index</p>
            <h3 className="font-headline font-black text-5xl text-white tracking-tighter mt-1 relative z-10">{bmi} <span className="text-xs uppercase tracking-widest text-[#cae252] font-semibold ml-1">BMI</span></h3>
        </div>

        {/* Body Fat Tile */}
        <div className="bg-gradient-to-br from-surface-container-low to-surface-container p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-10">
                <span className="material-symbols-outlined text-8xl">water_drop</span>
            </div>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.2em] relative z-10">Estimated Body Fat</p>
            <h3 className="font-headline font-black text-5xl text-white tracking-tighter mt-1 relative z-10">{bodyFat}<span className="text-2xl ml-1">%</span></h3>
        </div>

        {/* Calories Tile */}
        <div className="bg-gradient-to-br from-surface-container-low to-surface-container p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-10">
                <span className="material-symbols-outlined text-8xl">local_fire_department</span>
            </div>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.2em] relative z-10">Target Daily Calories (TDEE)</p>
            <h3 className="font-headline font-black text-5xl text-white tracking-tighter mt-1 relative z-10">{calories} <span className="text-xs uppercase tracking-widest text-primary font-semibold ml-1">KCAL</span></h3>
        </div>

      </div>

      <button 
        onClick={handleSaveAll}
        className="w-full mt-6 bg-surface-bright text-white font-bold py-5 rounded-full uppercase tracking-[0.2em] text-[12px] border border-white/10 active:scale-95 transition-transform flex justify-center items-center gap-2 hover:bg-[#cae252] hover:text-black hover:border-transparent group"
      >
        <span className="material-symbols-outlined text-[18px]">save</span>
        Sync to Profile
      </button>

    </div>
  );
}
