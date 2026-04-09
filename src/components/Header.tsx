import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0e0e0e] bg-gradient-to-b from-[#131313] to-transparent flex justify-between items-center px-6 py-4">
      <div className="flex items-center gap-3 active:scale-95 transition-transform">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-primary-container/20">
          <img
            className="w-full h-full object-cover"
            alt="User profile"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkzOfHiAeO3gtnwJqvPbm1WeGXxemCoAoC8Pnp6pXVpmEkGx1bgaIRVxPJ1BJT0IIJGUMVOKzzLgEvrkdyFxQZWWyMY35TGD_HzHSCT-lF1jErWzv0D-YTHh1G3aaeN9VmaQpdTLPoliIIzJbYEfCSihdy6QyvojWt8JPqmCAj0AEACqCbF-9GRtin5MCmr09X7sWfcBWBJpHQBeYt_iuMJLKplOLrCUDrH_k6EiWAcBcRBBphaz99s5pYenXS58awNRXZ4B1QnlY"
          />
        </div>
        <span className="text-2xl font-black text-[#f3ffca] tracking-widest italic font-lexend">
          KINETIC
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button className="material-symbols-outlined text-[#f3ffca] hover:opacity-80 transition-opacity">
          notifications
        </button>
      </div>
    </header>
  );
}
