import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComplaint extends Document {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  userName: string;
  subject: string;
  message: string;
  type: 'complaint' | 'query';
  status: 'pending' | 'in-review' | 'resolved' | 'rejected';
  adminNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema: Schema<IComplaint> = new Schema(
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
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['complaint', 'query'],
      default: 'query',
    },
    status: {
      type: String,
      enum: ['pending', 'in-review', 'resolved', 'rejected'],
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

const Complaint: Model<IComplaint> =
  mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);

export default Complaint;
