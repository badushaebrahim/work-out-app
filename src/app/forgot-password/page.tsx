"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "./actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const origin = window.location.origin;
      const res = await requestPasswordReset(email, origin);
      
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
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-tertiary/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-container-low border border-white/10 mb-6 group hover:border-[#CCFF00]/50 transition-colors">
            <span className="material-symbols-outlined text-3xl text-white group-hover:text-[#CCFF00] transition-colors">fitness_center</span>
          </Link>
          <h1 className="font-headline font-black text-4xl uppercase tracking-widest text-white mb-2">Recover Access</h1>
          <p className="text-on-surface-variant font-medium">Reset your elite account password.</p>
        </div>

        <div className="bg-surface-container-low/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-2xl">
          {success ? (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto border border-primary/30">
                <span className="material-symbols-outlined text-primary text-4xl">mark_email_read</span>
              </div>
              <div>
                <h2 className="font-headline font-bold text-xl text-white mb-2 uppercase tracking-wide">Check Your Inbox</h2>
                <p className="text-on-surface-variant">
                  We've sent a password reset link to <strong className="text-white">{email}</strong>. The link will expire in 15 minutes.
                </p>
              </div>
              <div className="pt-4">
                <Link href="/login" className="text-primary font-bold hover:underline uppercase tracking-widest text-sm">
                  Return to Login
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
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-4">Account Email</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-[#CCFF00] transition-colors">mail</span>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full bg-surface-container-highest border-none focus:ring-1 focus:ring-[#CCFF00]/30 text-white placeholder:text-on-surface-variant/30 py-4 pl-12 rounded-full transition-all duration-300 focus:outline-none"
                      placeholder="athlete@elite.com"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-gradient-to-br from-[#f3ffca] to-[#cafd00] hover:shadow-[0_0_30px_rgba(204,255,0,0.4)] text-black font-headline font-black uppercase tracking-widest py-5 rounded-full transform active:scale-95 transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Sending Link...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>

              <div className="text-center mt-6">
                <Link href="/login" className="text-on-surface-variant text-sm hover:text-white transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
