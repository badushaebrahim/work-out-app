"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/app/forgot-password/actions";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const res = await resetPassword(token, password);
      
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.error || "An error occurred");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-low/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-2xl">
      {success ? (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-[#CCFF00]/20 rounded-full flex items-center justify-center mx-auto border border-[#CCFF00]/30">
            <span className="material-symbols-outlined text-[#CCFF00] text-4xl">check_circle</span>
          </div>
          <div>
            <h2 className="font-headline font-bold text-xl text-white mb-2 uppercase tracking-wide">Password Updated</h2>
            <p className="text-on-surface-variant">
              Your password has been successfully reset. You can now access your elite account.
            </p>
          </div>
          <div className="pt-4">
            <Link href="/login" className="inline-block w-full bg-gradient-to-br from-[#f3ffca] to-[#cafd00] hover:shadow-[0_0_30px_rgba(204,255,0,0.4)] text-black font-headline font-black uppercase tracking-widest py-4 rounded-full transform active:scale-95 transition-all duration-200">
              Go to Login
            </Link>
          </div>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-xl p-4 mb-6 flex items-start gap-3">
              <span className="material-symbols-outlined text-error text-xl shrink-0">error</span>
              <p className="text-error text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-4">New Password</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-[#CCFF00] transition-colors">lock</span>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={!token}
                  className="w-full bg-surface-container-highest border-none focus:ring-1 focus:ring-[#CCFF00]/30 text-white placeholder:text-on-surface-variant/30 py-4 pl-12 rounded-full transition-all duration-300 focus:outline-none disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-4">Confirm Password</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-[#CCFF00] transition-colors">lock</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={!token}
                  className="w-full bg-surface-container-highest border-none focus:ring-1 focus:ring-[#CCFF00]/30 text-white placeholder:text-on-surface-variant/30 py-4 pl-12 rounded-full transition-all duration-300 focus:outline-none disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                disabled={loading || !token}
                type="submit"
                className="w-full bg-gradient-to-br from-[#f3ffca] to-[#cafd00] hover:shadow-[0_0_30px_rgba(204,255,0,0.4)] text-black font-headline font-black uppercase tracking-widest py-5 rounded-full transform active:scale-95 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Set New Password'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-tertiary/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-container-low border border-white/10 mb-6 group hover:border-[#CCFF00]/50 transition-colors">
            <span className="material-symbols-outlined text-3xl text-white group-hover:text-[#CCFF00] transition-colors">lock_reset</span>
          </Link>
          <h1 className="font-headline font-black text-4xl uppercase tracking-widest text-white mb-2">New Password</h1>
          <p className="text-on-surface-variant font-medium">Secure your elite account.</p>
        </div>

        <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
