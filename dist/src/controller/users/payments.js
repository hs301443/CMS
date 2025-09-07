"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptionPayments = exports.getPaymentById = exports.getAllPayments = exports.createPayment = void 0;
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const unauthorizedError_1 = require("../../Errors/unauthorizedError");
const response_1 = require("../../utils/response");
const subscriptions_1 = require("../../models/shema/subscriptions");
const payments_1 = require("../../models/shema/payments");
const createPayment = async (req, res) => {
    if (!req.user)
        throw new unauthorizedError_1.UnauthorizedError("user is not authenticated");
    const userId = req.user.id;
    const { amount, paymentMethodId } = req.body;
    if (!amount || !paymentMethodId)
        throw new BadRequest_1.BadRequest('Please provide all the required fields');
    const paymentMethod = await payments_1.PaymentModel.create({ amount, paymentMethodId, userId, status: 'pending' });
    (0, response_1.SuccessResponse)(res, { message: 'Payment created successfully', paymentMethod });
};
exports.createPayment = createPayment;
const getAllPayments = async (req, res) => {
    if (!req.user)
        throw new unauthorizedError_1.UnauthorizedError("user is not authenticated");
    const userId = req.user.id;
    const payments = await payments_1.PaymentModel.find({ userId }).populate('paymentmethod_id');
    (0, response_1.SuccessResponse)(res, { message: 'All payments fetched successfully', payments });
};
exports.getAllPayments = getAllPayments;
const getPaymentById = async (req, res) => {
    if (!req.user)
        throw new unauthorizedError_1.UnauthorizedError("user is not authenticated");
    const userId = req.user.id;
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest('Please provide payment id');
    const payment = await payments_1.PaymentModel.findOne({ _id: id, userId }).populate('paymentmethod_id');
    if (!payment)
        throw new NotFound_1.NotFound('Payment not found');
    (0, response_1.SuccessResponse)(res, { message: 'Payment fetched successfully', payment });
};
exports.getPaymentById = getPaymentById;
const getSubscriptionPayments = async (req, res) => {
    if (!req.user)
        throw new unauthorizedError_1.UnauthorizedError("user is not authenticated");
    const userId = req.user.id;
    const { subscriptionId } = req.params;
    if (!subscriptionId)
        throw new BadRequest_1.BadRequest('Please provide subscription id');
    const subscription = await subscriptions_1.SubscriptionModel.findOne({ _id: subscriptionId, userId });
    if (!subscription)
        throw new NotFound_1.NotFound('Subscription not found');
    const payments = await payments_1.PaymentModel.find({ subscription_id: subscriptionId, userId }).populate('paymentmethod_id');
    (0, response_1.SuccessResponse)(res, { message: 'All payments for the subscription fetched successfully', payments });
};
exports.getSubscriptionPayments = getSubscriptionPayments;
