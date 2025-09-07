"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePayment = exports.getPaymentById = exports.getAllPayment = void 0;
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const unauthorizedError_1 = require("../../Errors/unauthorizedError");
const response_1 = require("../../utils/response");
const payments_1 = require("../../models/shema/payments");
const plans_1 = require("../../models/shema/plans");
const getAllPayment = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const paymentMethods = await payments_1.PaymentModel.find();
    if (!paymentMethods)
        throw new NotFound_1.NotFound('No payment methods found');
    (0, response_1.SuccessResponse)(res, { message: 'All payment methods fetched successfully', paymentMethods });
};
exports.getAllPayment = getAllPayment;
const getPaymentById = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest('Please provide payment method id');
    const paymentMethod = await payments_1.PaymentModel.findById(id);
    if (!paymentMethod)
        throw new NotFound_1.NotFound('Payment method not found');
    (0, response_1.SuccessResponse)(res, { message: 'Payment method fetched successfully', paymentMethod });
};
exports.getPaymentById = getPaymentById;
const updatePayment = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest('Please provide payment method id');
    const { status, rejected_reason } = req.body;
    const payment = await payments_1.PaymentModel.findById(id);
    if (!payment)
        throw new NotFound_1.NotFound('Payment  not found');
    if (status === "rejected" && rejected_reason) {
        payment.rejected_reason = rejected_reason;
    }
    await payment.save();
    if (status === "approved") {
        const plan = await plans_1.PlanModel.findById(payment.get('planId') || req.body.planId);
        if (!plan)
            throw new NotFound_1.NotFound('plan not found');
    }
};
exports.updatePayment = updatePayment;
