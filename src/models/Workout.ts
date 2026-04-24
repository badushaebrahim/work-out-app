import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExercise {
  name: string;
  type: string;
  sets: number;
  reps: string;
  rest: string;
  executionSteps: string[];
  trainerInsight: string;
  imageUrl: String;
}

export interface IWorkout extends Document {
  title: string;
  description: string;
  mediaUrl?: string; // Video or image
  mediaType?: 'image' | 'video' | 'gif';
  tier: 'basic' | 'premium';
  categories: string[];
  exercises?: IExercise[];
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: String, required: true },
  rest: { type: String, required: true },
  executionSteps: [{ type: String }],
  trainerInsight: { type: String },
  imageUrl: { type: String }
});

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
    exercises: {
      type: [ExerciseSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Workout: Model<IWorkout> = mongoose.models.Workout || mongoose.model<IWorkout>('Workout', WorkoutSchema);

export default Workout;
