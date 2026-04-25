import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import connectToDatabase from '@/lib/db';
import Razorpay from 'razorpay';
import PaymentAudit from '@/models/PaymentAudit';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
// Amount in qatari riyal  (QAR 250.0)
const PREMIUM_AMOUNT = 25000;
const CURRENCY = 'QAR';

export async function POST() {
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

    // Don't allow already-premium users to purchase again
    if (decoded.role === 'premium' || decoded.role === 'admin') {
      return NextResponse.json({ message: 'Already premium' }, { status: 400 });
    }

    let receipt = `pr_${decoded.userId}_${Date.now()}`;

    if (receipt.length > 40) {
      // take only last 40 characters
      receipt = receipt.slice(-40);
    }


    const order = await razorpay.orders.create({
      amount: PREMIUM_AMOUNT,
      currency: CURRENCY,
      receipt: receipt,
      notes: {
        userId: decoded.userId,
        email: decoded.email,
      },
    });

    // write in to to my DB PayementAudit with order id , amount , currency , userId , email 
    await connectToDatabase();
    const payementAudit = new PaymentAudit({
      orderId: order.id,
      paymentId: "",
      signature: "",
      status: "pending",
      amount: PREMIUM_AMOUNT,
      currency: CURRENCY,
      userId: decoded.userId,
      email: decoded.email,
    });

    await payementAudit.save();

    return NextResponse.json({
      orderId: order.id,
      amount: PREMIUM_AMOUNT,
      currency: CURRENCY,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Razorpay create-order error:', error);
    return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
  }
}
