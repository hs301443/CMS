"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePromoCodeWithPlans = exports.updatePromoCodeWithPlans = exports.getPromoCodeWithPlansById = exports.getAllPromoCodesWithPlans = exports.createPromoCodeWithPlans = void 0;
const promo_code_1 = require("../../models/shema/promo_code");
const response_1 = require("../../utils/response");
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const unauthorizedError_1 = require("../../Errors/unauthorizedError");
const promocode_plans_1 = require("../../models/shema/promocode_plans");
const createPromoCodeWithPlans = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError('access denied');
    const { promoCodeData, planLinks } = req.body;
    if (!promoCodeData || !planLinks)
        throw new BadRequest_1.BadRequest("Missing promo code data or plan links");
    const promoCode = await promo_code_1.PromoCodeModel.create({
        ...promoCodeData,
        available_users: promoCodeData.maxusers
    });
    const plans = planLinks.map((link) => ({
        ...link,
        codeId: promoCode._id
    }));
    await promocode_plans_1.PromoCodePlanModel.insertMany(plans);
    (0, response_1.SuccessResponse)(res, {
        message: "Promo code created with linked plans",
        promoCode
    });
};
exports.createPromoCodeWithPlans = createPromoCodeWithPlans;
const getAllPromoCodesWithPlans = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError('access denied');
    const promos = await promo_code_1.PromoCodeModel.find().lean().exec();
    const promosWithPlans = await Promise.all(promos.map(async (promo) => {
        const plans = await promocode_plans_1.PromoCodePlanModel.find({ codeId: promo._id }).populate('planId').lean();
        // ✅ ظبط التواريخ
        const formattedPromo = {
            ...promo,
            start_date: promo.start_date ? new Date(promo.start_date).toISOString().split("T")[0] : null,
            end_date: promo.end_date ? new Date(promo.end_date).toISOString().split("T")[0] : null,
        };
        const formattedPlans = plans.map((plan) => {
            const p = plan; // أو as { start_date?: Date; end_date?: Date }
            return {
                ...p,
                start_date: p.start_date ? new Date(p.start_date).toISOString().split("T")[0] : null,
                end_date: p.end_date ? new Date(p.end_date).toISOString().split("T")[0] : null,
            };
        });
        return { ...formattedPromo, plans: formattedPlans };
    }));
    (0, response_1.SuccessResponse)(res, { promos: promosWithPlans });
};
exports.getAllPromoCodesWithPlans = getAllPromoCodesWithPlans;
const getPromoCodeWithPlansById = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError('access denied');
    const { id } = req.params;
    const promo = await promo_code_1.PromoCodeModel.findById(id).populate('planId').lean();
    if (!promo)
        throw new NotFound_1.NotFound("Promo code not found");
    const plans = await promocode_plans_1.PromoCodePlanModel.find({ codeId: id }).lean();
    // ✅ ظبط التواريخ
    const formattedPromo = {
        ...promo,
        start_date: promo.start_date ? new Date(promo.start_date).toISOString().split("T")[0] : null,
        end_date: promo.end_date ? new Date(promo.end_date).toISOString().split("T")[0] : null,
    };
    const formattedPlans = plans.map((plan) => {
        const p = plan; // أو as { start_date?: Date; end_date?: Date }
        return {
            ...p,
            start_date: p.start_date ? new Date(p.start_date).toISOString().split("T")[0] : null,
            end_date: p.end_date ? new Date(p.end_date).toISOString().split("T")[0] : null,
        };
    });
    (0, response_1.SuccessResponse)(res, { promo: formattedPromo, plans: formattedPlans });
};
exports.getPromoCodeWithPlansById = getPromoCodeWithPlansById;
const updatePromoCodeWithPlans = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError('access denied');
    const { id } = req.params;
    const { promoCodeData, planLinks } = req.body;
    const promo = await promo_code_1.PromoCodeModel.findByIdAndUpdate(id, promoCodeData, { new: true });
    if (!promo)
        throw new NotFound_1.NotFound("Promo code not found");
    // حذف الخطط القديمة المرتبطة
    await promocode_plans_1.PromoCodePlanModel.deleteMany({ codeId: id });
    // إضافة الخطط الجديدة
    const plans = planLinks.map((link) => ({ ...link, codeId: promo._id }));
    await promocode_plans_1.PromoCodePlanModel.insertMany(plans);
    (0, response_1.SuccessResponse)(res, { message: "Promo code and plans updated", promo });
};
exports.updatePromoCodeWithPlans = updatePromoCodeWithPlans;
const deletePromoCodeWithPlans = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError('access denied');
    const { id } = req.params;
    const promo = await promo_code_1.PromoCodeModel.findByIdAndDelete(id);
    if (!promo)
        throw new NotFound_1.NotFound("Promo code not found");
    await promocode_plans_1.PromoCodePlanModel.deleteMany({ codeId: id });
    (0, response_1.SuccessResponse)(res, { message: "Promo code and linked plans deleted" });
};
exports.deletePromoCodeWithPlans = deletePromoCodeWithPlans;
