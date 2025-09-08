import mongoose from "mongoose";


const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan_id:{type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    paymentmethod_id : { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod', required: true },
    amount: { type: Number, required: true },
    status: { type: String,enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    rejected_reason: { type: String},
    payment_date: { type: Date, required: true },
    
}, { timestamps: true });


export const PaymentModel = mongoose.model('Payment', paymentSchema);