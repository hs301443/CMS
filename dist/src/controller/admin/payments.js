"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePayment = exports.getPaymentByIdAdmin = exports.getAllPaymentsAdmin = void 0;
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const unauthorizedError_1 = require("../../Errors/unauthorizedError");
const response_1 = require("../../utils/response");
const subscriptions_1 = require("../../models/shema/subscriptions");
const payments_1 = require("../../models/shema/payments");
const getAllPaymentsAdmin = async (req, res) => {
    if (!req.user || req.user.role !== "admin")
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const payments = await payments_1.PaymentModel.find()
        .populate("userId", "name email") // هات اسم و ايميل اليوزر بس
        .populate("plan_id") // هات تفاصيل البلان
        .populate("paymentmethod_id"); // هات تفاصيل الميثود
    const pending = payments.filter(p => p.status === "pending");
    const history = payments.filter(p => ["approved", "rejected"].includes(p.status));
    (0, response_1.SuccessResponse)(res, {
        message: "All payments fetched successfully (admin)",
        payments: {
            pending,
            history,
        },
    });
};
exports.getAllPaymentsAdmin = getAllPaymentsAdmin;
// ✅ Admin: Get payment by id
const getPaymentByIdAdmin = async (req, res) => {
    if (!req.user || req.user.role !== "admin")
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest("Please provide payment id");
    const payment = await payments_1.PaymentModel.findById(id)
        .populate("userId", "name email")
        .populate("plan_id")
        .populate("paymentmethod_id");
    if (!payment)
        throw new NotFound_1.NotFound("Payment not found");
    (0, response_1.SuccessResponse)(res, { message: "Payment fetched successfully (admin)", payment });
};
exports.getPaymentByIdAdmin = getPaymentByIdAdmin;
// ✅ Admin: Update payment status
const updatePayment = async (req, res) => {
    if (!req.user || req.user.role !== "admin")
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const { id } = req.params;
    const { status, rejected_reason } = req.body;
    if (!["approved", "rejected"].includes(status)) {
        throw new BadRequest_1.BadRequest("Status must be either approved or rejected");
    }
    const payment = await payments_1.PaymentModel.findById(id).populate("plan_id");
    if (!payment)
        throw new NotFound_1.NotFound("Payment not found");
    // ✅ Update payment
    payment.status = status;
    if (status === "rejected") {
        payment.rejected_reason = rejected_reason || "No reason provided";
    }
    await payment.save();
    // ✅ If approved → create subscription
    if (status === "approved") {
        const plan = payment.plan_id; // populated plan
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(startDate.getMonth() + (plan.durationMonths || 1)); // 👈 لازم يكون عندك مدة البلان
        await subscriptions_1.SubscriptionModel.create({
            userId: payment.userId,
            planId: payment.plan_id,
            PaymentId: payment._id,
            startDate,
            endDate,
            websites_created_count: 0,
            websites_remaining_count: plan.websites_limit || 0, // 👈 لازم البلان فيه limit
        });
    }
    (0, response_1.SuccessResponse)(res, { message: "Payment status updated successfully", payment });
};
exports.updatePayment = updatePayment;
