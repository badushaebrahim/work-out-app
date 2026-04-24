import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExercise extends Document {
  name: string;
  categories: string;
  type: string;
  sets: number;
  reps: string;
  rest: string;
  executionSteps: string[];
  trainerInsight: string;
  imageUrl: string;
}

const ExerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true },
  categories: { type: String, required: true },
  type: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: String, required: true },
  rest: { type: String, required: true },
  executionSteps: [{ type: String }],
  trainerInsight: { type: String },
  imageUrl: { type: String, required: false },
}, {
  timestamps: true,
});

const Exercise: Model<IExercise> = mongoose.models.Exercise || mongoose.model<IExercise>('Exercise', ExerciseSchema);

export default Exercise;
