import { Request, Response } from 'express';
import { PaymentMethodModel } from '../../models/shema/payment_methods';
import { BadRequest } from '../../Errors/BadRequest';
import { NotFound } from '../../Errors/NotFound';
import { UnauthorizedError } from '../../Errors/unauthorizedError';
import { SuccessResponse } from '../../utils/response';
import { SubscriptionModel } from '../../models/shema/subscriptions';
import { PaymentModel } from '../../models/shema/payments';
import { UserModel } from '../../models/shema/auth/User';
import { PromoCodeModel } from '../../models/shema/promo_code';
import { PromoCodeUserModel } from '../../models/shema/promocode_users';

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



export const updatePayment = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== "admin") throw new UnauthorizedError("Access denied");

  const { id } = req.params;
  const { status, rejected_reason } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    throw new BadRequest("Status must be either approved or rejected");
  }

  const payment = await PaymentModel.findById(id).populate("plan_id");
  if (!payment) throw new NotFound("Payment not found");

  // تحديث حالة الدفع
  payment.status = status;
  if (status === "rejected") {
    payment.rejected_reason = rejected_reason || "No reason provided";
    await payment.save();
    return SuccessResponse(res, { message: "Payment rejected", payment });
  }

  // لو approved
  const plan: any = payment.plan_id;
  const user = await UserModel.findById(payment.userId);
  if (!user) throw new NotFound("User not found");

  // ✅ التحقق من Promo Code
  if (payment.code) {
    const promo = await PromoCodeModel.findOne({ 
      code: payment.code, 
      isActive: true,
      start_date: { $lte: new Date() },
      end_date: { $gte: new Date() },
      available_users:{ $gt: 0 }
    });

    if (promo) {
      promo.available_users -= 1;
      await promo.save();

      const alreadyUsed = await PromoCodeUserModel.findOne({
        userId: user._id,
        codeId: promo._id
      });
      if (!alreadyUsed) {
        await PromoCodeUserModel.create({
          userId: user._id,
          codeId: promo._id
        });
      }
    }
  }

  // تحديد عدد الأشهر للإشتراك بناءً على subscriptionType
  let monthsToAdd = 0;
  const subscriptionType = payment.subscriptionType || "quarterly"; // افتراضي quarterly إذا مش محدد
  switch(subscriptionType) {
    case "quarterly": monthsToAdd = 3; break;
    case "semi_annually": monthsToAdd = 6; break;
    case "annually": monthsToAdd = 12; break;
    default: throw new BadRequest("Invalid subscription type");
  }

  // التعامل مع الاشتراك
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
  } else if (user.planId.toString() === plan._id.toString()) {
    const subscription = await SubscriptionModel.findOne({
      userId: user._id,
      planId: plan._id,
      status: "active",
    }).sort({ createdAt: -1 });

    if (!subscription) throw new NotFound("Active subscription not found");

    subscription.endDate.setMonth(subscription.endDate.getMonth() + monthsToAdd);
    await subscription.save();
  } else {
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

  await payment.save();
  SuccessResponse(res, { message: "Payment approved successfully", payment });
};

