import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { decryptPasswordServerSide } from '@/lib/encryption';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, encryptedPassword, deviceId, name } = await req.json();

    if (!email || !encryptedPassword || !name) {
      return NextResponse.json({ message: 'Email, password, and name are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const decryptedPassword = decryptPasswordServerSide(encryptedPassword);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(decryptedPassword, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
      deviceId, // bind this device to the account on registration
      role: 'basic',
      userName: name,
    });

    return NextResponse.json({ message: 'User created successfully', userId: user._id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
