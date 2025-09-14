"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoCodeModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PromoCodeSchema = new mongoose_1.default.Schema({
    code: { type: String, required: true, unique: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    discount_type: { type: String, enum: ['percentage', 'amount'], default: 'percentage' },
    discount_value: { type: Number, required: true },
    isActive: { type: Boolean, domocodeefault: true },
    maxusers: { type: Number, default: 0 },
    available_users: { type: Number, default: 0 },
    status: { type: String, enum: ['first_time', 'All', 'renew'], default: 'first_time' }
}, { timestamps: true });
exports.PromoCodeModel = mongoose_1.default.model('PromoCode', PromoCodeSchema);
