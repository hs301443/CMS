import mongoose from "mongoose";


const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paymentmethod_id : { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod', required: true },
    amount: { type: Number, required: true },
    status: { type: String,enum: ['pending', 'approved', 'rejected'], default: 'pending' },
   rejected_reason: { type: String,}
    
}, { timestamps: true });


export const PaymentModel = mongoose.model('Payment', paymentSchema);