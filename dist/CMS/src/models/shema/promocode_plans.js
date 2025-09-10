"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoCodePlanModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const promocode_planSchema = new mongoose_1.default.Schema({
    codeId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'PromoCode', required: true },
    planId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Plan', required: true },
    applies_to_monthly: { type: Boolean, default: false },
    applies_to_quarterly: { type: Boolean, default: false },
    applies_to_semi_annually: { type: Boolean, default: false },
    applies_to_yearly: { type: Boolean, default: false }
}, { timestamps: true });
exports.PromoCodePlanModel = mongoose_1.default.model('PromoCodePlan', promocode_planSchema);
