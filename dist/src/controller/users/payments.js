"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentById = exports.getAllPayments = exports.createPayment = void 0;
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const unauthorizedError_1 = require("../../Errors/unauthorizedError");
const response_1 = require("../../utils/response");
const payments_1 = require("../../models/shema/payments");
const plans_1 = require("../../models/shema/plans");
const createPayment = async (req, res) => {
    if (!req.user)
        throw new unauthorizedError_1.UnauthorizedError("User is not authenticated");
    const userId = req.user.id;
    const { plan_id, paymentmethod_id, amount } = req.body;
    if (!amount || !paymentmethod_id || !plan_id) {
        throw new BadRequest_1.BadRequest("Please provide all the required fields");
    }
    // ✅ تحقق من أن الـ plan موجود
    const plan = await plans_1.PlanModel.findById(plan_id);
    if (!plan)
        throw new NotFound_1.NotFound("Plan not found");
    // ✅ تحقق من المبلغ مقابل الأسعار في الـ plan
    const validAmounts = [
        plan.price_quarterly,
        plan.price_semi_annually,
        plan.price_annually,
    ].filter((price) => price !== undefined && price !== null); // نشيل undefined/null
    if (!validAmounts.includes(amount)) {
        throw new BadRequest_1.BadRequest("Invalid payment amount for this plan");
    }
    // ✅ إنشاء الـ payment
    const payment = await payments_1.PaymentModel.create({
        amount,
        paymentmethod_id,
        plan_id,
        payment_date: new Date(),
        userId,
        status: "pending",
    });
    (0, response_1.SuccessResponse)(res, {
        message: "Payment created successfully",
        payment,
    });
};
exports.createPayment = createPayment;
const getAllPayments = async (req, res) => {
    if (!req.user)
        throw new unauthorizedError_1.UnauthorizedError("user is not authenticated");
    const payments = await payments_1.PaymentModel.find({ userId: req.user.id })
        .populate("paymentmethod_id")
        .populate("plan_id"); // ✅ هنا جبنا تفاصيل البلان كمان
    const pending = payments.filter(p => p.status === "pending");
    const history = payments.filter(p => ["approved", "rejected"].includes(p.status));
    (0, response_1.SuccessResponse)(res, {
        message: "All payments fetched successfully",
        payments: {
            pending,
            history,
        },
    });
};
exports.getAllPayments = getAllPayments;
const getPaymentById = async (req, res) => {
    if (!req.user)
        throw new unauthorizedError_1.UnauthorizedError("user is not authenticated");
    const userId = req.user.id;
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest("Please provide payment id");
    const payment = await payments_1.PaymentModel.findOne({ _id: id, userId })
        .populate("paymentmethod_id")
        .populate("plan_id"); // ✅ جبت تفاصيل البلان برضه
    if (!payment)
        throw new NotFound_1.NotFound("Payment not found");
    (0, response_1.SuccessResponse)(res, { message: "Payment fetched successfully", payment });
};
exports.getPaymentById = getPaymentById;
