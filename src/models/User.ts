import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email?: string;
  password?: string;
  role: 'basic' | 'premium' | 'admin';
  deviceId?: string; // used for anonymous/basic visitors
  firstVisitDate?: Date;
  premiumValidUntil?: Date; // For premium tracking
  metrics?: {
    bmi?: number;
    bodyFat?: number;
    dailyCalories?: number;
  };
  createdAt: Date;
  updatedAt: Date;
  userName: String;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    userName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ['basic', 'premium', 'admin'],
      default: 'basic',
    },
    deviceId: {
      type: String,
      // unique: true,
      sparse: true, // sparse because registered users might not rely on deviceId uniquely
    },
    firstVisitDate: {
      type: Date,
      default: Date.now,
    },
    premiumValidUntil: {
      type: Date,
    },
    metrics: {
      bmi: Number,
      bodyFat: Number,
      dailyCalories: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from compiling the model multiple times in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
