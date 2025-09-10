"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePromoCode = exports.updatePromoCode = exports.getPromoCodeById = exports.getAllPromoCode = exports.createpromoCode = void 0;
const promo_code_1 = require("../../models/shema/promo_code");
const response_1 = require("../../utils/response");
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const unauthorizedError_1 = require("../../Errors/unauthorizedError");
const createpromoCode = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError('access denied');
    const data = req.body;
    if (!data)
        throw new BadRequest_1.BadRequest('Please provide all the required fields');
    const promocode = await promo_code_1.PromoCodeModel.create(data);
    (0, response_1.SuccessResponse)(res, { message: 'Promo Code created successfully', promocode });
};
exports.createpromoCode = createpromoCode;
const getAllPromoCode = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError('access denied');
    const data = await promo_code_1.PromoCodeModel.find();
    if (!data)
        throw new NotFound_1.NotFound('No Promo Code found');
    (0, response_1.SuccessResponse)(res, { message: 'All Promo Code fetched successfully', data });
};
exports.getAllPromoCode = getAllPromoCode;
const getPromoCodeById = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError('access denied');
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest('Please provide Promo Code id');
    const data = await promo_code_1.PromoCodeModel.findById(id);
    if (!data)
        throw new NotFound_1.NotFound('Promo Code not found');
    (0, response_1.SuccessResponse)(res, { message: 'Promo Code fetched successfully', data });
};
exports.getPromoCodeById = getPromoCodeById;
const updatePromoCode = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError('access denied');
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest('Please provide Promo Code id');
    const data = req.body;
    const promocode = await promo_code_1.PromoCodeModel.findByIdAndUpdate(id, { ...data }, { new: true });
    if (!promocode)
        throw new NotFound_1.NotFound('Promo Code not found');
    (0, response_1.SuccessResponse)(res, { message: 'Promo Code updated successfully', promocode });
};
exports.updatePromoCode = updatePromoCode;
const deletePromoCode = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError('access denied');
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest('Please provide Promo Code id');
    const promocode = await promo_code_1.PromoCodeModel.findByIdAndDelete(id);
    if (!promocode)
        throw new NotFound_1.NotFound('Promo Code not found');
    (0, response_1.SuccessResponse)(res, { message: 'Promo Code deleted successfully' });
};
exports.deletePromoCode = deletePromoCode;
