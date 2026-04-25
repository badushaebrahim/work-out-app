'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';

type AuthUser = {
  userId: string;
  email: string;
  role: string;
};

type PaymentState = 'idle' | 'loading' | 'processing' | 'success' | 'error';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function UpgradePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // Check auth status on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        // Not logged ask user redirect user ot login page
        router.push('/login?redirect=/upgrade');
      } finally {
        setAuthChecked(true);
      }
    }
    checkAuth();
  }, []);

  async function handleUpgrade() {
    setErrorMessage('');

    // 1. Check if logged in
    if (!user) {
      router.push('/login?redirect=/upgrade');
      return;
    }

    // 2. Already premium
    if (user.role === 'premium' || user.role === 'admin') {
      setErrorMessage('You already have premium access!');
      return;
    }

    setPaymentState('loading');

    try {
      // 3. Create order
      const orderRes = await fetch('/api/razorpay/create-order', { method: 'POST' });
      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.message || 'Failed to create order');
      }

      const { orderId, amount, currency, keyId } = await orderRes.json();
      console.log(orderId, amount, currency, keyId);
      // 4. Open Razorpay checkout
      const options = {
        key: keyId,
        amount,
        currency,
        name: 'Buddy Elite',
        description: 'Premium Subscription — 1 Month',
        order_id: orderId,
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          // 5. Verify payment
          setPaymentState('processing');
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              const err = await verifyRes.json();
              throw new Error(err.message || 'Payment verification failed');
            }

            const result = await verifyRes.json();
            setExpiryDate(
              new Date(result.premiumValidUntil).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            );
            setPaymentState('success');
          } catch (err: any) {
            setPaymentState('error');
            setErrorMessage(err.message || 'Payment verification failed');
          }
        },
        prefill: {
          email: user.email || '',
        },
        theme: {
          color: '#CCFF00',
        },
        modal: {
          ondismiss: function () {
            setPaymentState('idle');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setPaymentState('error');
        setErrorMessage(response.error?.description || 'Payment failed. Please try again.');
      });
      rzp.open();
    } catch (err: any) {
      setPaymentState('error');
      setErrorMessage(err.message || 'Something went wrong');
    }
  }

  // Success state
  if (paymentState === 'success') {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pt-24 pb-32 relative overflow-hidden">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[400px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>

        <div className="relative z-10 max-w-lg w-full text-center">
          <div className="bg-surface-container-low rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl p-10">

            <div className="w-24 h-24 mx-auto bg-primary/15 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <span className="material-symbols-outlined text-[48px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
            </div>

            <h1 className="font-headline font-black text-4xl uppercase tracking-tighter text-white mb-3 italic">
              Welcome to Elite
            </h1>
            <p className="text-on-surface-variant font-medium text-sm mb-6">
              Your premium access is now active.
            </p>

            <div className="bg-surface-container-highest rounded-xl p-4 border border-primary/20 mb-8">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Premium Valid Until</p>
              <p className="text-lg font-bold text-primary">{expiryDate}</p>
            </div>

            <button
              onClick={() => router.push('/')}
              className="w-full bg-gradient-to-r from-primary to-[#cafd00] text-black font-headline font-black py-5 rounded-full uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(202,253,0,0.2)] hover:opacity-90 active:scale-95 transition-all outline-none"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pt-24 pb-32 relative overflow-hidden">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Background aesthetics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-[400px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
      </div>

      <div className="relative z-10 max-w-lg w-full">
        <div className="bg-surface-container-low rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">

          <div className="bg-gradient-to-br from-tertiary/20 via-surface-container-low to-surface-container-low p-8 text-center border-b border-white/5">
            <span className="material-symbols-outlined text-[60px] text-tertiary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            <h1 className="font-headline font-black text-4xl uppercase tracking-tighter text-white mb-2 italic">Upgrade Required</h1>
            <p className="text-on-surface-variant font-medium text-sm">You&apos;ve hit the limit. Only Buddy Elite members can proceed past this point.</p>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-tertiary">check_circle</span>
                <span className="font-bold text-sm uppercase tracking-widest text-white">Full Library Access</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-tertiary">check_circle</span>
                <span className="font-bold text-sm uppercase tracking-widest text-white">Advanced Hypertrophy</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-tertiary">check_circle</span>
                <span className="font-bold text-sm uppercase tracking-widest text-white">Direct Coach Insights</span>
              </div>
            </div>

            <div className="bg-surface-container-highest rounded-2xl p-6 border border-tertiary/20 text-center">
              <h3 className="font-label font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-2">Premium Subscription</h3>
              <div className="flex justify-center items-end gap-1 mb-1">
                <span className="font-bold text-xl text-white">QR</span>
                <span className="font-headline text-5xl font-black text-white leading-none">250</span>
                <span className="font-bold text-on-surface-variant">/mo</span>
              </div>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="bg-error/10 border border-error/20 rounded-xl p-4 text-center">
                <p className="text-error text-sm font-medium">{errorMessage}</p>
              </div>
            )}

            {/* Auth hint */}
            {authChecked && !user && (
              <div className="bg-surface-container-highest rounded-xl p-4 border border-white/5 text-center">
                <p className="text-on-surface-variant text-xs mb-2">You need to be logged in to upgrade</p>
                <Link href="/login?redirect=/upgrade" className="text-tertiary text-sm font-bold uppercase tracking-widest hover:underline">
                  Sign in first →
                </Link>
              </div>
            )}

            <button
              onClick={handleUpgrade}
              disabled={paymentState === 'loading' || paymentState === 'processing'}
              className="w-full bg-gradient-to-r from-tertiary to-tertiary-dim text-black font-headline font-black py-5 rounded-full uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(255,221,121,0.2)] hover:opacity-90 active:scale-95 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {paymentState === 'loading' && (
                <>
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Creating Order...
                </>
              )}
              {paymentState === 'processing' && (
                <>
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Verifying Payment...
                </>
              )}
              {(paymentState === 'idle' || paymentState === 'error') && (
                <>
                  {user ? 'Pay & Upgrade Now' : 'Login & Upgrade'}
                  <span className="material-symbols-outlined text-black">bolt</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-on-surface-variant italic mt-4">
              Powered by Razorpay · Secure 256-bit encryption
            </p>
          </div>

        </div>

        <div className="mt-8 text-center">
          <Link href="/workouts" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Return to Basic Tier
          </Link>
        </div>
      </div>
    </main>
  );
}
