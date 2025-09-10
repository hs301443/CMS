"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPromoCodesByIds = exports.getUserPromoCodes = void 0;
const promocode_plans_1 = require("../../models/shema/promocode_plans");
const response_1 = require("../../utils/response");
const mongoose_1 = __importDefault(require("mongoose"));
const getUserPromoCodes = async (req, res) => {
    if (!req.user)
        throw new Error("User not authenticated");
    const userPlanId = req.user.planId;
    if (!userPlanId) {
        return (0, response_1.SuccessResponse)(res, { message: "User has no plan", promoCodes: [] });
    }
    const now = new Date();
    // 1️⃣ جلب كل الـ PromoCodePlan اللي تتعلق بالـ Plan
    const promoCodePlans = await promocode_plans_1.PromoCodePlanModel.find({ planId: userPlanId })
        .populate("codeId");
    // 2️⃣ فلترة الكوبونات حسب الصلاحية و isActive
    const validPromoCodes = promoCodePlans
        .map(pcp => pcp.codeId)
        .filter((code) => {
        return (code &&
            typeof code === "object" &&
            "isActive" in code &&
            "start_date" in code &&
            "end_date" in code &&
            code.isActive &&
            new Date(code.start_date) <= now &&
            new Date(code.end_date) >= now);
    });
    (0, response_1.SuccessResponse)(res, { message: "User promo codes fetched successfully", promoCodes: validPromoCodes });
};
exports.getUserPromoCodes = getUserPromoCodes;
const getUserPromoCodesByIds = async (req, res) => {
    if (!req.user)
        throw new Error("User not authenticated");
    const userPlanId = req.user.planId;
    if (!userPlanId) {
        return (0, response_1.SuccessResponse)(res, { message: "User has no plan", promoCodes: [] });
    }
    const idsParam = req.query.ids; // "id1,id2,id3"
    if (!idsParam) {
        return (0, response_1.SuccessResponse)(res, { message: "No promo code IDs provided", promoCodes: [] });
    }
    const ids = idsParam.split(",").map(id => new mongoose_1.default.Types.ObjectId(id));
    const now = new Date();
    // جلب كل الـ PromoCodePlan اللي تتعلق بالـ Plan
    const promoCodePlans = await promocode_plans_1.PromoCodePlanModel.find({
        planId: userPlanId,
        codeId: { $in: ids }
    }).populate("codeId");
    const validPromoCodes = promoCodePlans
        .map((pcp) => pcp.codeId)
        .filter((code) => {
        if (!code)
            return false;
        const startDate = new Date(code.start_date);
        const endDate = new Date(code.end_date);
        return code.isActive && startDate <= now && endDate >= now;
    });
    (0, response_1.SuccessResponse)(res, { message: "User promo codes fetched successfully", promoCodes: validPromoCodes });
};
exports.getUserPromoCodesByIds = getUserPromoCodesByIds;
