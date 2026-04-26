import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITrainerQuery extends Document {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  userName: string;
  trainerName: string;
  experience: string;
  message: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected' | 'contacted';
  adminNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

const TrainerQuerySchema: Schema<ITrainerQuery> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    userName: {
      type: String,
      trim: true,
      default: '',
    },
    trainerName: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'contacted'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const TrainerQuery: Model<ITrainerQuery> =
  mongoose.models.TrainerQuery || mongoose.model<ITrainerQuery>('TrainerQuery', TrainerQuerySchema);

export default TrainerQuery;
