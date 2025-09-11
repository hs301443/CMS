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
    const promos = await promo_code_1.PromoCodeModel.find()
        .lean()
        .exec();
    const promosWithPlans = await Promise.all(promos.map(async (promo) => {
        const plans = await promocode_plans_1.PromoCodePlanModel.find({ codeId: promo._id }).lean();
        return { ...promo, plans };
    }));
    (0, response_1.SuccessResponse)(res, { promos: promosWithPlans });
};
exports.getAllPromoCodesWithPlans = getAllPromoCodesWithPlans;
const getPromoCodeWithPlansById = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError('access denied');
    const { id } = req.params;
    const promo = await promo_code_1.PromoCodeModel.findById(id);
    if (!promo)
        throw new NotFound_1.NotFound("Promo code not found");
    const plans = await promocode_plans_1.PromoCodePlanModel.find({ codeId: id });
    (0, response_1.SuccessResponse)(res, { promo, plans });
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
