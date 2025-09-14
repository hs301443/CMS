import mongoose from "mongoose";

const PromoCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    discount_type: { type:String, enum: ['percentage', 'amount'], default: 'percentage' },
    discount_value: { type: Number, required: true },
    isActive: { type: Boolean, domocodeefault: true },
    maxusers:{ type: Number, default: 0 },
    available_users:{ type: Number, default: 0 },
    status:{type:String, enum:['first_time','All','renew'], default:'first_time'}

}, { timestamps: true });

export const PromoCodeModel = mongoose.model('PromoCode', PromoCodeSchema);