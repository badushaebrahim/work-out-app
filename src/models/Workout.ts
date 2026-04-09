import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWorkout extends Document {
  title: string;
  description: string;
  mediaUrl?: string; // Video or image
  mediaType?: 'image' | 'video' | 'gif';
  tier: 'basic' | 'premium';
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

const WorkoutSchema: Schema<IWorkout> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    mediaUrl: {
      type: String,
    },
    mediaType: {
      type: String,
      enum: ['image', 'video', 'gif'],
    },
    tier: {
      type: String,
      enum: ['basic', 'premium'],
      default: 'basic',
    },
    categories: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Workout: Model<IWorkout> = mongoose.models.Workout || mongoose.model<IWorkout>('Workout', WorkoutSchema);

export default Workout;
