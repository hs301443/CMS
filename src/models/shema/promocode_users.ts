import mongoose from "mongoose";

const promocodeuserschema= new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    codeId: { type: mongoose.Schema.Types.ObjectId, ref: 'PromoCode', required: true },
}, { timestamps: true });

export const PromoCodeUserModel = mongoose.model('PromoCodeUser', promocodeuserschema);