"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePromoCodePlan = exports.deletePromoCodePlan = exports.getAllPromoCodePlan = exports.getPromoCodePlanById = exports.createPromoCodePLan = void 0;
const promocode_plans_1 = require("../../models/shema/promocode_plans");
const response_1 = require("../../utils/response");
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const unauthorizedError_1 = require("../../Errors/unauthorizedError");
const createPromoCodePLan = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError('access denied');
    const { planId, promocodeId } = req.body;
    if (!planId || !promocodeId)
        throw new BadRequest_1.BadRequest('Please provide all the required fields');
    if (promocodeId.end_date() > new Date())
        throw new BadRequest_1.BadRequest('Promo code is not expired');
    const data = await promocode_plans_1.PromoCodePlanModel.create({ planId, promocodeId });
    (0, response_1.SuccessResponse)(res, { message: 'Promo Code Plan created successfully', data });
};
exports.createPromoCodePLan = createPromoCodePLan;
const getPromoCodePlanById = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError('access denied');
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest('Please provide Promo Code Plan id');
    const data = await promocode_plans_1.PromoCodePlanModel.findById(id);
    if (!data)
        throw new NotFound_1.NotFound('Promo Code Plan not found');
    (0, response_1.SuccessResponse)(res, { message: 'Promo Code Plan fetched successfully', data });
};
exports.getPromoCodePlanById = getPromoCodePlanById;
const getAllPromoCodePlan = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError('access denied');
    const data = await promocode_plans_1.PromoCodePlanModel.find();
    if (!data)
        throw new NotFound_1.NotFound('No Promo Code Plan found');
    (0, response_1.SuccessResponse)(res, { message: 'All Promo Code Plan fetched successfully', data });
};
exports.getAllPromoCodePlan = getAllPromoCodePlan;
const deletePromoCodePlan = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError('access denied');
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest('Please provide Promo Code Plan id');
    const data = await promocode_plans_1.PromoCodePlanModel.findByIdAndDelete(id);
    if (!data)
        throw new NotFound_1.NotFound('Promo Code Plan not found');
    (0, response_1.SuccessResponse)(res, { message: 'Promo Code Plan deleted successfully' });
};
exports.deletePromoCodePlan = deletePromoCodePlan;
const updatePromoCodePlan = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError('access denied');
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest('Please provide Promo Code Plan id');
    const data = req.body;
    const promocode = await promocode_plans_1.PromoCodePlanModel.findByIdAndUpdate(id, { ...data }, { new: true });
    if (!promocode)
        throw new NotFound_1.NotFound('Promo Code Plan not found');
    (0, response_1.SuccessResponse)(res, { message: 'Promo Code Plan updated successfully', promocode });
};
exports.updatePromoCodePlan = updatePromoCodePlan;
