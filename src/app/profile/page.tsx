import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    redirect('/login');
  }

  const decoded = await verifyJwt(token);
  if (!decoded || !decoded.userId) {
    redirect('/login');
  }

  await connectToDatabase();
  const user = await User.findById(decoded.userId).lean();

  if (!user) {
    redirect('/login');
  }

  // Admin gets directed to the Admin Dashboard
  if (user.role === 'admin') {
    redirect('/admin');
  }

  return (
    <main className="pt-24 pb-32 px-6 max-w-lg mx-auto">
      <h1 className="font-headline text-4xl font-black uppercase text-white mb-8">Your Profile</h1>
      <div className="bg-surface-container-high rounded-xl p-6 border border-white/5 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Email</p>
          <p className="text-lg font-bold">{user.email}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Membership Tier</p>
          <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full ${user.role === 'premium' ? 'bg-[#CCFF00] text-black' : 'bg-surface-container-low text-white'}`}>
            {user.role}
          </span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Device ID bound</p>
          <p className="text-sm font-mono truncate">{user.deviceId || 'Platform Web'}</p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {user.role === 'basic' && (
          <form action={async () => {
            'use server';

            redirect('/upgrade');
          }}>
            <button className="w-full bg-gradient-to-br from-tertiary to-tertiary-dim text-black font-headline font-black py-4 rounded-xl uppercase tracking-widest active:scale-95 transition-transform">
              Upgrade to Premium
            </button></form>
        )}
        <form action={async () => {
          'use server';
          const cookieStore2 = await cookies();
          cookieStore2.delete('authToken');
          redirect('/login');
        }}>
          <button type="submit" className="w-full bg-surface-container-low text-error border border-error/20 font-headline py-4 rounded-xl active:scale-95 transition-transform">
            Sign Out
          </button>
        </form>
      </div>
    </main>
  );
}
