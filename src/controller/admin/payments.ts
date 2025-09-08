import { Request, Response } from 'express';
import { PaymentMethodModel } from '../../models/shema/payment_methods';
import { BadRequest } from '../../Errors/BadRequest';
import { NotFound } from '../../Errors/NotFound';
import { UnauthorizedError } from '../../Errors/unauthorizedError';
import { SuccessResponse } from '../../utils/response';
import { SubscriptionModel } from '../../models/shema/subscriptions';
import { PaymentModel } from '../../models/shema/payments';
import { PlanModel } from '../../models/shema/plans';

export const getAllPaymentsAdmin = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== "admin") throw new UnauthorizedError("Access denied");

  const payments = await PaymentModel.find()
    .populate("userId", "name email") // هات اسم و ايميل اليوزر بس
    .populate("plan_id") // هات تفاصيل البلان
    .populate("paymentmethod_id"); // هات تفاصيل الميثود

  const pending = payments.filter(p => p.status === "pending");
  const history = payments.filter(p => ["approved", "rejected"].includes(p.status));

  SuccessResponse(res, {
    message: "All payments fetched successfully (admin)",
    payments: {
      pending,
      history,
    },
  });
};

// ✅ Admin: Get payment by id
export const getPaymentByIdAdmin = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== "admin") throw new UnauthorizedError("Access denied");

  const { id } = req.params;
  if (!id) throw new BadRequest("Please provide payment id");

  const payment = await PaymentModel.findById(id)
    .populate("userId", "name email")
    .populate("plan_id")
    .populate("paymentmethod_id");

  if (!payment) throw new NotFound("Payment not found");

  SuccessResponse(res, { message: "Payment fetched successfully (admin)", payment });
};

// ✅ Admin: Update payment status
export const updatePayment = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== "admin") throw new UnauthorizedError("Access denied");

  const { id } = req.params;
  const { status, rejected_reason } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    throw new BadRequest("Status must be either approved or rejected");
  }

  const payment = await PaymentModel.findById(id).populate("plan_id");
  if (!payment) throw new NotFound("Payment not found");

  // ✅ Update payment
  payment.status = status;
  if (status === "rejected") {
    payment.rejected_reason = rejected_reason || "No reason provided";
  }
  await payment.save();

  // ✅ If approved → create subscription
  if (status === "approved") {
    const plan: any = payment.plan_id; // populated plan
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + (plan.durationMonths || 1)); // 👈 لازم يكون عندك مدة البلان

    await SubscriptionModel.create({
      userId: payment.userId,
      planId: payment.plan_id,
      PaymentId: payment._id,
      startDate,
      endDate,
      websites_created_count: 0,
      websites_remaining_count: plan.websites_limit || 0, // 👈 لازم البلان فيه limit
    });
  }

  SuccessResponse(res, { message: "Payment status updated successfully", payment });
};
