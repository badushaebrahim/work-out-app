"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const deviceId = localStorage.getItem('kinetic_device_id');
      const { encryptPasswordClientSide } = await import('@/lib/encryption');
      const encryptedPassword = encryptPasswordClientSide(password);

      // Extending our API logic to also create users nicely
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, encryptedPassword, deviceId, name: username })
      });

      const data = await res.json();
      if (res.ok) {
        // Redirect to login after successful registration
        router.push('/login');
      } else {
        setError(data.message || 'Failed to register');
      }
    } catch (err) {
      setError('An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Imagery */}
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover opacity-40 grayscale"
          alt="Moody dark gym interior with high contrast shadows"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsk2wSoK98llGfa1DD8dHOtJq3tRMnn4kjAeuK89VYKB1s87qmPgnthAXvi_VhI_7k3fVwOwoqZPfgcbS0VUf69iVU3ExW5MK7oIcNzeRbllT4eZ3mPeU3Mr7aplNroQic9cvOS2_671e7tuhZ5vMk9GM21A07_MR9iBycapRlZLwt_GDLgC2-9OuGQnYtoZ4IWEXDUE0v2i7DUr4v3_kE1o_Nm0JwHpgBAOObdMttOTRmefcHsGVjqc1jOM789bgXojPKa0nFE7o"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/50"></div>
      </div>
      
      <section className="relative z-10 w-full max-w-xl px-6 py-12 md:py-24">
        <div className="mb-12">
          <h1 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4 text-white">
            Unleash <span className="text-[#CCFF00]">Elite</span><br />Potential
          </h1>
          <p className="text-on-surface-variant text-lg font-light tracking-wide max-w-sm">
            Access the obsidian-tier training environment and transform your performance limits.
          </p>
        </div>

        <div className="bg-surface-container-low/40 backdrop-blur-xl p-8 md:p-12 rounded-xl border border-white/5 space-y-8">
          {error && (
            <div className="p-4 border border-error-dim bg-error-dim/20 rounded-xl text-error text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">Username</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-[#CCFF00] transition-colors">person</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-surface-container-highest border-none focus:ring-1 focus:ring-[#CCFF00]/30 text-white placeholder:text-on-surface-variant/30 py-4 pl-12 rounded-full transition-all duration-300 focus:outline-none"
                  placeholder="CHAMPION_2024"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-[#CCFF00] transition-colors">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-surface-container-highest border-none focus:ring-1 focus:ring-[#CCFF00]/30 text-white placeholder:text-on-surface-variant/30 py-4 pl-12 rounded-full transition-all duration-300 focus:outline-none"
                  placeholder="PERFORMANCE@KINETIC.COM"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">Password</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-[#CCFF00] transition-colors">lock</span>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-surface-container-highest border-none focus:ring-1 focus:ring-[#CCFF00]/30 text-white placeholder:text-on-surface-variant/30 py-4 pl-12 rounded-full transition-all duration-300 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-gradient-to-br from-[#f3ffca] to-[#cafd00] hover:shadow-[0_0_30px_rgba(204,255,0,0.4)] text-black font-headline font-black uppercase tracking-widest py-5 rounded-full transform active:scale-95 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="text-center space-y-4">
            <p className="text-on-surface-variant font-label text-sm">
              Already part of the elite? 
              <Link href="/login" className="text-[#CCFF00] font-bold hover:underline ml-1">Sign In</Link>
            </p>
            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] text-on-surface-variant/50 uppercase tracking-tighter leading-relaxed">
                By joining, you agree to our <span className="underline">Performance Terms</span> and <span className="underline">Privacy Protocol</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="hidden lg:block absolute -right-20 top-1/4 -rotate-90">
        <span className="text-[180px] font-headline font-black text-white/5 uppercase select-none pointer-events-none tracking-tighter">
          EVOLVE
        </span>
      </div>
    </main>
  );
}
