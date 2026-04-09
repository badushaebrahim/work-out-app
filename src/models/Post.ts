import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  author: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema<IPost> = new Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true, maxLength: 200 },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, default: 'General' },
    author: { type: String, default: 'Admin' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
