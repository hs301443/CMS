"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPromoCodeUserById = exports.getPromoCodeUser = void 0;
const promocode_users_1 = require("../../models/shema/promocode_users");
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const unauthorizedError_1 = require("../../Errors/unauthorizedError");
const response_1 = require("../../utils/response");
const getPromoCodeUser = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError('access denied');
    const promocode = await promocode_users_1.PromoCodeUserModel.find().populate('userId', 'name email').populate('codeId');
    if (!promocode)
        throw new NotFound_1.NotFound('Promocode not found');
    (0, response_1.SuccessResponse)(res, { message: 'Promocode found successfully', promocode });
};
exports.getPromoCodeUser = getPromoCodeUser;
const getPromoCodeUserById = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError('access denied');
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest('Please provide promocode id');
    const promocode = await promocode_users_1.PromoCodeUserModel.findById(id).populate('userId', 'name email').populate('codeId');
    if (!promocode)
        throw new NotFound_1.NotFound('Promocode not found');
    (0, response_1.SuccessResponse)(res, { message: 'Promocode found successfully', promocode });
};
exports.getPromoCodeUserById = getPromoCodeUserById;
