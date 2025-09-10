"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPromoCodePlanById = exports.getPromoCodePlans = void 0;
const promocode_plans_1 = require("../../models/shema/promocode_plans");
const response_1 = require("../../utils/response");
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const getPromoCodePlans = async (req, res) => {
    const data = await promocode_plans_1.PromoCodePlanModel.find();
    if (!data)
        throw new NotFound_1.NotFound('Promo Code Plan not found');
    (0, response_1.SuccessResponse)(res, { message: 'Promo Code Plan fetched successfully', data });
};
exports.getPromoCodePlans = getPromoCodePlans;
const getPromoCodePlanById = async (req, res) => {
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest('Please provide Promo Code Plan id');
    const data = await promocode_plans_1.PromoCodePlanModel.findById(id);
    if (!data)
        throw new NotFound_1.NotFound('Promo Code Plan not found');
    (0, response_1.SuccessResponse)(res, { message: 'Promo Code Plan fetched successfully', data });
};
exports.getPromoCodePlanById = getPromoCodePlanById;
