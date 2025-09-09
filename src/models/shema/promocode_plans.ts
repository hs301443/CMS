import mongoose from "mongoose";

const promocode_planSchema = new mongoose.Schema({
    promocodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'PromoCode', required: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    applies_to_monthly:{type: Boolean, default: false},
    applies_to_quarterly:{type: Boolean, default: false},
    applies_to_semi_annually:{type: Boolean, default: false},
    applies_to_yearly:{type: Boolean, default: false}

}, { timestamps: true });

export const PromoCodePlanModel = mongoose.model('PromoCodePlan', promocode_planSchema);