'use client';

import { useState, useTransition } from 'react';
import { submitComplaint, submitTrainerQuery } from './actions';

/* ────────────────────────── FAQ SECTION ────────────────────────── */

const FAQ_DATA = [
  {
    q: 'What is Buddy Elite?',
    a: 'Buddy Elite is a premium fitness platform that provides curated workout programs, exercise libraries, and personalized training guidance to help you achieve your fitness goals.',
  },
  {
    q: 'What does Premium membership include?',
    a: 'Premium members get access to exclusive workout programs, advanced exercise libraries with trainer insights, priority support, and personalized health metric tracking (BMI, Body Fat, TDEE).',
  },
  {
    q: 'How do I upgrade to Premium?',
    a: 'Visit the Upgrade page from your profile or the main dashboard. Select a plan, complete the payment via Razorpay, and your account will be upgraded instantly.',
  },
  {
    q: 'Can I cancel my Premium subscription?',
    a: 'Yes. Your premium access remains active until the end of your billing period. After that, your account reverts to Basic. Contact support for assistance.',
  },
  {
    q: 'What is Device Binding?',
    a: 'For security, your account is bound to one device at a time. If you log in from a new device, you\'ll be prompted to confirm the switch. This protects your account from unauthorized access.',
  },
  {
    q: 'How do I report an issue with a workout?',
    a: 'Use the "Complaints & Queries" form below to describe the issue. Our team reviews all submissions and will respond as quickly as possible.',
  },
  {
    q: 'I\'m a gym trainer — can I partner with Buddy?',
    a: 'Absolutely! Scroll down to the "Trainer Partnership" section and fill out the inquiry form. We\'ll review your application and get in touch.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-white/5 rounded-xl overflow-hidden transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-container-high/50 transition-colors"
      >
        <span className="font-bold text-sm text-white pr-4">{q}</span>
        <span
          className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 shrink-0 ${open ? 'rotate-180' : ''}`}
        >
          expand_more
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="px-4 pb-4 text-sm text-on-surface-variant leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export function FAQSection() {
  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-tertiary text-2xl">help</span>
        <h2 className="font-headline font-black text-xl uppercase tracking-widest text-white">FAQ</h2>
      </div>
      <div className="space-y-2">
        {FAQ_DATA.map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} />
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────── COMPLAINT FORM ────────────────────────── */

export function ComplaintForm({ userEmail }: { userEmail: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await submitComplaint(formData);
      setResult(res);
      if (res.success) {
        form.reset();
        setTimeout(() => setResult(null), 4000);
      }
    });
  }

  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-2">
        <span className="material-symbols-outlined text-error text-2xl">support_agent</span>
        <h2 className="font-headline font-black text-xl uppercase tracking-widest text-white">
          Complaints & Queries
        </h2>
      </div>
      <p className="text-on-surface-variant text-sm mb-6">
        Have an issue or a question? Let us know and we&apos;ll get back to you.
      </p>

      <form onSubmit={handleSubmit} className="bg-surface-container-high rounded-xl p-6 border border-white/5 space-y-4">
        {/* Read-only user email display */}
        <div>
          <label className="text-xs uppercase tracking-widest text-on-surface-variant mb-1 block">Your Email</label>
          <p className="text-sm font-bold text-white/70 bg-surface-container-lowest rounded-lg px-4 py-3">{userEmail}</p>
        </div>

        {/* Type selector */}
        <div>
          <label className="text-xs uppercase tracking-widest text-on-surface-variant mb-1 block">Type</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="type" value="query" defaultChecked className="accent-[#CCFF00]" />
              <span className="text-sm text-white font-medium">Query</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="type" value="complaint" className="accent-[#CCFF00]" />
              <span className="text-sm text-white font-medium">Complaint</span>
            </label>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="complaint-subject" className="text-xs uppercase tracking-widest text-on-surface-variant mb-1 block">
            Subject
          </label>
          <input
            id="complaint-subject"
            name="subject"
            type="text"
            required
            maxLength={200}
            placeholder="Brief description of your issue"
            className="w-full bg-surface-container-lowest border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#CCFF00]/50 transition-colors"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="complaint-message" className="text-xs uppercase tracking-widest text-on-surface-variant mb-1 block">
            Message
          </label>
          <textarea
            id="complaint-message"
            name="message"
            required
            maxLength={2000}
            rows={4}
            placeholder="Describe your issue or question in detail..."
            className="w-full bg-surface-container-lowest border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#CCFF00]/50 transition-colors resize-none"
          />
        </div>

        {/* Feedback */}
        {result?.success && (
          <div className="flex items-center gap-2 text-sm text-[#CCFF00] bg-[#CCFF00]/10 rounded-lg px-4 py-3 animate-pulse">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            Submitted successfully! We&apos;ll get back to you soon.
          </div>
        )}
        {result?.error && (
          <div className="flex items-center gap-2 text-sm text-error bg-error/10 rounded-lg px-4 py-3">
            <span className="material-symbols-outlined text-lg">error</span>
            {result.error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-br from-error to-error-dim text-white font-headline font-black py-3 rounded-xl uppercase tracking-widest text-sm active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </section>
  );
}

/* ────────────────────────── TRAINER QUERY FORM ────────────────────────── */

export function TrainerQueryForm({ userEmail }: { userEmail: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await submitTrainerQuery(formData);
      setResult(res);
      if (res.success) {
        form.reset();
        setTimeout(() => setResult(null), 4000);
      }
    });
  }

  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-2">
        <span className="material-symbols-outlined text-tertiary text-2xl">sports</span>
        <h2 className="font-headline font-black text-xl uppercase tracking-widest text-white">
          Trainer Partnership
        </h2>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-br from-tertiary/10 to-tertiary/5 border border-tertiary/20 rounded-xl p-5 mb-6">
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-tertiary text-3xl shrink-0 mt-0.5">fitness_center</span>
          <div>
            <h3 className="font-headline font-bold text-white text-sm uppercase tracking-wider mb-1">
              Are you a Gym Trainer?
            </h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Want to provide <strong className="text-white">Buddy</strong> to your clients and offer your own
              custom exercises? Partner with us and reach thousands of athletes.
              Fill out the form below and our team will contact you!
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-high rounded-xl p-6 border border-white/5 space-y-4">
        {/* Read-only email */}
        <div>
          <label className="text-xs uppercase tracking-widest text-on-surface-variant mb-1 block">Your Email</label>
          <p className="text-sm font-bold text-white/70 bg-surface-container-lowest rounded-lg px-4 py-3">{userEmail}</p>
        </div>

        {/* Trainer Name */}
        <div>
          <label htmlFor="trainer-name" className="text-xs uppercase tracking-widest text-on-surface-variant mb-1 block">
            Trainer / Business Name
          </label>
          <input
            id="trainer-name"
            name="trainerName"
            type="text"
            required
            placeholder="e.g. FitPro Academy"
            className="w-full bg-surface-container-lowest border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-tertiary/50 transition-colors"
          />
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="trainer-experience" className="text-xs uppercase tracking-widest text-on-surface-variant mb-1 block">
            Experience
          </label>
          <input
            id="trainer-experience"
            name="experience"
            type="text"
            required
            placeholder="e.g. 5 years, Certified PT, Gym Owner"
            className="w-full bg-surface-container-lowest border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-tertiary/50 transition-colors"
          />
        </div>

        {/* Phone (optional) */}
        <div>
          <label htmlFor="trainer-phone" className="text-xs uppercase tracking-widest text-on-surface-variant mb-1 block">
            Phone <span className="text-white/30">(Optional)</span>
          </label>
          <input
            id="trainer-phone"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            className="w-full bg-surface-container-lowest border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-tertiary/50 transition-colors"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="trainer-message" className="text-xs uppercase tracking-widest text-on-surface-variant mb-1 block">
            Message
          </label>
          <textarea
            id="trainer-message"
            name="message"
            required
            maxLength={2000}
            rows={4}
            placeholder="Tell us about your training style, the exercises you want to offer, and how you plan to use Buddy for your clients..."
            className="w-full bg-surface-container-lowest border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-tertiary/50 transition-colors resize-none"
          />
        </div>

        {/* Feedback */}
        {result?.success && (
          <div className="flex items-center gap-2 text-sm text-tertiary bg-tertiary/10 rounded-lg px-4 py-3 animate-pulse">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            Application submitted! We&apos;ll review and contact you soon.
          </div>
        )}
        {result?.error && (
          <div className="flex items-center gap-2 text-sm text-error bg-error/10 rounded-lg px-4 py-3">
            <span className="material-symbols-outlined text-lg">error</span>
            {result.error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-br from-tertiary to-tertiary-dim text-black font-headline font-black py-3 rounded-xl uppercase tracking-widest text-sm active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Submitting...' : 'Contact Us'}
        </button>
      </form>
    </section>
  );
}
