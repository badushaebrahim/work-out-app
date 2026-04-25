import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayementAudit extends Document {
    orderId: string;
    paymentId: string;
    signature: string;
    status: string;
    amount: number;
    currency: string;
    userId: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentAuditSchema: Schema<IPayementAudit> = new Schema(
    {
        orderId: { type: String, required: true, unique: true },
        paymentId: { type: String },
        signature: { type: String },
        status: { type: String, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
        userId: { type: String, required: true },
        email: { type: String },
    },
    { timestamps: true }
);

const PaymentAudit: Model<IPayementAudit> = mongoose.models.PayementAudit || mongoose.model<IPayementAudit>('PayementAudit', PaymentAuditSchema);

export default PaymentAudit;
