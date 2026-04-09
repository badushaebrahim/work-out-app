import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 w-full z-50 rounded-t-[2rem] bg-[#0e0e0e]/80 backdrop-blur-xl border-t border-white/5 shadow-[0_-10px_40px_rgba(202,253,0,0.08)] flex justify-around items-center h-20 px-4 pb-2">
      <Link
        href="/"
        className="flex flex-col items-center justify-center text-[#f3ffca] transition-all duration-300 scale-110"
      >
        <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>
          home_max
        </span>
        <span className="font-manrope text-[10px] font-bold uppercase tracking-widest">HOME</span>
      </Link>
      
      <Link
        href="/workouts"
        className="flex flex-col items-center justify-center text-gray-600 transition-all duration-300 hover:text-[#f3ffca]/80 active:scale-90"
      >
        <span className="material-symbols-outlined mb-1">fitness_center</span>
        <span className="font-manrope text-[10px] font-bold uppercase tracking-widest">WORKOUTS</span>
      </Link>
      
      <Link
        href="/hub"
        className="flex flex-col items-center justify-center text-gray-600 transition-all duration-300 hover:text-[#f3ffca]/80 active:scale-90"
      >
        <span className="material-symbols-outlined mb-1">workspace_premium</span>
        <span className="font-manrope text-[10px] font-bold uppercase tracking-widest">HUB</span>
      </Link>
      
      <Link
        href="/profile"
        className="flex flex-col items-center justify-center text-gray-600 transition-all duration-300 hover:text-[#f3ffca]/80 active:scale-90"
      >
        <span className="material-symbols-outlined mb-1">person</span>
        <span className="font-manrope text-[10px] font-bold uppercase tracking-widest">PROFILE</span>
      </Link>
    </nav>
  );
}
