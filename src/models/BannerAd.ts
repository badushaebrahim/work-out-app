import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBannerAd extends Document {
  title: string;
  imageUrl: string;
  redirectUrl: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerAdSchema: Schema<IBannerAd> = new Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    redirectUrl: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const BannerAd: Model<IBannerAd> = mongoose.models.BannerAd || mongoose.model<IBannerAd>('BannerAd', BannerAdSchema);

export default BannerAd;
