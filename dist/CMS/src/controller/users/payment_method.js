"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentMethodById = exports.getAllPaymentMethods = void 0;
const payment_methods_1 = require("../../models/shema/payment_methods");
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const unauthorizedError_1 = require("../../Errors/unauthorizedError");
const response_1 = require("../../utils/response");
const getAllPaymentMethods = async (req, res) => {
    if (!req.user)
        throw new unauthorizedError_1.UnauthorizedError('User not authenticated');
    const paymentMethods = await payment_methods_1.PaymentMethodModel.find();
    if (!paymentMethods)
        throw new NotFound_1.NotFound('No payment methods found');
    (0, response_1.SuccessResponse)(res, { message: 'All payment methods fetched successfully', paymentMethods });
};
exports.getAllPaymentMethods = getAllPaymentMethods;
const getPaymentMethodById = async (req, res) => {
    if (!req.user)
        throw new unauthorizedError_1.UnauthorizedError('User not authenticated');
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest('Please provide payment method id');
    const paymentMethod = await payment_methods_1.PaymentMethodModel.findById(id);
    if (!paymentMethod)
        throw new NotFound_1.NotFound('Payment method not found');
    (0, response_1.SuccessResponse)(res, { message: 'Payment method fetched successfully', paymentMethod });
};
exports.getPaymentMethodById = getPaymentMethodById;
