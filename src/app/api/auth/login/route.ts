import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { decryptPasswordServerSide } from '@/lib/encryption';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, encryptedPassword, deviceId, forceDeviceUpdate } = await req.json();

    if (!email || !encryptedPassword) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const decryptedPassword = decryptPasswordServerSide(encryptedPassword);
    const isValid = await bcrypt.compare(decryptedPassword, user.password);

    if (!isValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Device ID check — only if user already has a deviceId stored
    if (deviceId && user.deviceId && user.deviceId !== deviceId && !forceDeviceUpdate) {
      // Device mismatch — ask for confirmation before proceeding
      return NextResponse.json({
        message: 'This account is linked to another device. Do you want to switch to this device? Only one device can be active at a time.',
        deviceMismatch: true,
        currentDevice: user.deviceId.slice(-6), // show last 6 chars for reference
      }, { status: 409 });
    }

    // If forceDeviceUpdate is true OR this is a new device for a user without one, update it
    if (deviceId && (forceDeviceUpdate || !user.deviceId)) {
      user.deviceId = deviceId;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const cookieStore = await cookies();
    cookieStore.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    return NextResponse.json({ 
      message: 'Logged in successfully',
      user: {
        email: user.email,
        role: user.role,
        premiumValidUntil: user.premiumValidUntil
      }
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
