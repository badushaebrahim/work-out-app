"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deviceMismatch, setDeviceMismatch] = useState(false);
  const [mismatchMessage, setMismatchMessage] = useState('');
  const router = useRouter();

  const doLogin = async (forceDeviceUpdate = false) => {
    setLoading(true);
    setError('');

    try {
      const deviceId = localStorage.getItem('buddy_device_id') || '';
      const { encryptPasswordClientSide } = await import('@/lib/encryption');
      const encryptedPassword = encryptPasswordClientSide(password);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, encryptedPassword, deviceId, forceDeviceUpdate }),
      });

      const data = await res.json();

      if (res.status === 409 && data.deviceMismatch) {
        // Show device mismatch confirmation
        setDeviceMismatch(true);
        setMismatchMessage(data.message);
        setLoading(false);
        return;
      }

      if (res.ok) {
        setDeviceMismatch(false);
        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/profile');
        }
      } else {
        setError(data.message || 'Failed to login');
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeviceMismatch(false);
    await doLogin(false);
  };

  const handleConfirmDeviceSwitch = async () => {
    await doLogin(true);
  };

  const handleCancelDeviceSwitch = () => {
    setDeviceMismatch(false);
    setMismatchMessage('');
  };

  return (
    <main className="flex-grow flex flex-col md:flex-row relative overflow-hidden min-h-screen z-50 bg-background">
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative h-full">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            alt="Moody high-contrast editorial photography of a muscular athlete in a dark gym"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqCICd7CuiX5PyTMFbccY6ZptZYUyS_Hvvj_tcHfsRb9GaxIK2CQ0hEHwE2bQ2q-jzbfnD-0mjY1-xx22mY8Up9aZl7ujdipmOxwwad1lZeM8xWBUobfXDp3LJpXvXbqNaDr9FITvkWSBHG2N48tMcqF2WKpWuF2BmvroJ4dPhqw9JOUf0iPwmdC1LC_rU6meUmijPPOHy--AlCiB6ZzyIxQfRryrf80MSMD1T5akmeOK4d_s8mZB_Xo3H8imuzKElk_bL8s1SP30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-background flex-grow"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background flex-grow"></div>
        </div>
        <div className="relative z-20 flex flex-col justify-end p-16 w-full">
          <h1 className="font-headline font-black text-7xl lg:text-9xl tracking-tighter leading-none mb-4 italic text-white">
            PUSH<br />BEYOND
          </h1>
          <p className="font-body text-xl text-on-surface-variant max-w-md font-light leading-relaxed">
            Access your elite training ecosystem. Performance isn&apos;t an act, it&apos;s a habit.
          </p>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center px-8 py-12 md:px-16 lg:px-24 bg-background z-30">
        <header className="mb-8">
          <div className="inline-block py-1 px-3 bg-surface-container-highest rounded-full mb-6 relative">
            <span className="text-[10px] font-headline font-bold tracking-[0.2em] text-[#CCFF00] uppercase relative z-10">
              Elite Access
            </span>
          </div>
          <h2 className="font-headline font-black text-4xl lg:text-5xl uppercase tracking-tight text-on-surface mb-2">
            BUDDY ELITE
          </h2>
          <p className="text-on-surface-variant font-medium">Welcome back, Athlete.</p>
        </header>

        {error && (
          <div className="mb-4 p-4 border border-error-dim bg-error-dim/20 rounded-xl text-error text-sm font-bold">
            {error}
          </div>
        )}

        {/* Device Mismatch Confirmation Dialog */}
        {deviceMismatch && (
          <div className="mb-6 bg-surface-container-highest border border-tertiary/30 rounded-2xl p-6 space-y-4 animate-in">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-tertiary text-2xl mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>phonelink_lock</span>
              <div>
                <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-white mb-2">Device Change Detected</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{mismatchMessage}</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleConfirmDeviceSwitch}
                disabled={loading}
                className="flex-1 bg-gradient-to-br from-tertiary to-tertiary-dim text-black font-headline font-bold py-3 rounded-full uppercase tracking-widest text-xs active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Switching...' : 'Yes, Switch Device'}
              </button>
              <button
                onClick={handleCancelDeviceSwitch}
                className="flex-1 bg-surface-container-low text-white border border-white/10 font-headline font-bold py-3 rounded-full uppercase tracking-widest text-xs active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface-variant px-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors">mail</span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary-container/30 transition-all font-body focus:outline-none"
                placeholder="name@domain.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-end px-1">
              <label className="text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="password">
                Password
              </label>
              <Link className="text-[10px] font-headline font-bold uppercase tracking-widest text-[#CCFF00] hover:opacity-80 transition-opacity" href="/forgot-password">
                Forgot Password?
              </Link>
            </div>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors">lock</span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary-container/30 transition-all font-body focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <div className="pt-4">
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-gradient-to-br from-[#f3ffca] to-[#cafd00] hover:shadow-[0_0_30px_rgba(204,255,0,0.25)] text-black font-headline font-black text-sm uppercase tracking-widest py-5 rounded-full flex justify-center items-center gap-2 group transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>}
            </button>
          </div>
        </form>

        <div className="mt-12 space-y-8">
          <p className="text-center text-sm font-body text-on-surface-variant">
            Don&apos;t have an account? 
            <Link href="/register" className="text-[#CCFF00] font-bold uppercase tracking-tight ml-1 hover:underline underline-offset-4">Register Now</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
