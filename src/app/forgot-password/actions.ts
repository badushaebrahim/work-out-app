'use server';

import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import PasswordResetToken from '@/models/PasswordResetToken';
import { sendPasswordResetEmail } from '@/lib/mailer';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export async function requestPasswordReset(email: string, origin: string) {
  try {
    await connectToDatabase();
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not for security reasons
      return { success: true };
    }

    // Delete any existing tokens for this user
    await PasswordResetToken.deleteMany({ userId: user._id });

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');

    // Save token to DB
    await PasswordResetToken.create({
      userId: user._id,
      token: token
    });

    const resetUrl = `${origin}/reset-password?token=${token}`;
    
    // Send email
    await sendPasswordResetEmail(user.email, resetUrl);

    return { success: true };
  } catch (error) {
    console.error('Password reset request error:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    await connectToDatabase();

    const resetToken = await PasswordResetToken.findOne({ token });
    if (!resetToken) {
      return { success: false, error: 'Invalid or expired token. Please request a new password reset.' };
    }

    const user = await User.findById(resetToken.userId);
    if (!user) {
      return { success: false, error: 'User not found.' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete the token so it can't be used again
    await PasswordResetToken.deleteOne({ _id: resetToken._id });

    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
