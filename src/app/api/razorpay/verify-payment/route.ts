import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import PaymentAudit from '@/models/PaymentAudit';

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const decoded = await verifyJwt(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: 'Invalid session' }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ message: 'Missing payment details' }, { status: 400 });
    }

    // Verify signature: HMAC SHA256 of "order_id|payment_id" with key_secret
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ message: 'Payment verification failed' }, { status: 400 });
    }
    // update the  PaymentAudit status and paymentId and signature
    await connectToDatabase();
    await PaymentAudit.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: 'verified',
      }
    );
    // Payment is verified — upgrade the user



    const premiumValidUntil = new Date();
    premiumValidUntil.setMonth(premiumValidUntil.getMonth() + 1);

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      {
        role: 'premium',
        premiumValidUntil,
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Re-issue JWT with updated role so the session reflects premium immediately
    const newToken = jwt.sign(
      { userId: user._id, role: 'premium', email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    cookieStore.set('authToken', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified. Welcome to Premium!',
      premiumValidUntil: premiumValidUntil.toISOString(),
    });
  } catch (error: any) {
    console.error('Razorpay verify-payment error:', error);
    return NextResponse.json({ message: 'Verification failed' }, { status: 500 });
  }
}
