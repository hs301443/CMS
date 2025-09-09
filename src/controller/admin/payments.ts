import { Request, Response } from 'express';
import { PaymentMethodModel } from '../../models/shema/payment_methods';
import { BadRequest } from '../../Errors/BadRequest';
import { NotFound } from '../../Errors/NotFound';
import { UnauthorizedError } from '../../Errors/unauthorizedError';
import { SuccessResponse } from '../../utils/response';
import { SubscriptionModel } from '../../models/shema/subscriptions';
import { PaymentModel } from '../../models/shema/payments';
import { UserModel } from '../../models/shema/auth/User';

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

  if (status === "approved") {
    const plan: any = payment.plan_id;
    const user = await UserModel.findById(payment.userId);
    if (!user) throw new NotFound("User not found");

    // نحدد المدة حسب الـ amount اللي دفعه
    let monthsToAdd = 0;
    if (payment.amount === plan.price_quarterly) {
      monthsToAdd = 3;
    } else if (payment.amount === plan.price_semi_annually) {
      monthsToAdd = 6;
    } else if (payment.amount === plan.price_annually) {
      monthsToAdd = 12;
    } else {
      throw new BadRequest("Invalid payment amount for this plan");
    }

    // 1- لو user.planId = null → أول اشتراك
    if (!user.planId) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(startDate.getMonth() + monthsToAdd);

      await SubscriptionModel.create({
        userId: user._id,
        planId: plan._id,
        PaymentId: payment._id,
        startDate,
        endDate,
        status: "active",
        websites_created_count: 0,
        websites_remaining_count: plan.website_limit || 0,
      });

      user.planId = plan._id;
      await user.save();
    }

    // 2- نفس الخطة → نمد الاشتراك الحالي
    else if (user.planId.toString() === plan._id.toString()) {
      const subscription = await SubscriptionModel.findOne({
        userId: user._id,
        planId: plan._id,
        status: "active",
      }).sort({ createdAt: -1 });

      if (!subscription) throw new NotFound("Active subscription not found");

      subscription.endDate.setMonth(subscription.endDate.getMonth() + monthsToAdd);
      await subscription.save();
    }

    // 3- خطة مختلفة → نخلي القديم expired وننشئ جديد
    else {
      await SubscriptionModel.updateMany(
        { userId: user._id, status: "active" },
        { $set: { status: "expired" } }
      );

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(startDate.getMonth() + monthsToAdd);

      await SubscriptionModel.create({
        userId: user._id,
        planId: plan._id,
        PaymentId: payment._id,
        startDate,
        endDate,
        status: "active",
        websites_created_count: 0,
        websites_remaining_count: plan.website_limit || 0,
      });

      user.planId = plan._id;
      await user.save();
    }
  }

  SuccessResponse(res, { message: "Payment status updated successfully", payment });
};
