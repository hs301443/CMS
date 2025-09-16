
import mongoose from "mongoose";
import { Request, Response } from "express";
import { PlanModel } from "../../models/shema/plans";
import { PaymentModel } from "../../models/shema/payments";
import { PromoCodeModel } from "../../models/shema/promo_code";
import { PromoCodePlanModel } from "../../models/shema/promocode_plans";
import { PromoCodeUserModel } from "../../models/shema/promocode_users";
import { BadRequest } from "../../Errors/BadRequest";
import { NotFound } from "../../Errors/NotFound";
import { UnauthorizedError } from "../../Errors/unauthorizedError";
import { SuccessResponse } from "../../utils/response";


export const createPayment = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("User is not authenticated");

  const userId = req.user.id;
  const { plan_id, paymentmethod_id, amount, code, subscriptionType } = req.body;

  if (!amount || !paymentmethod_id || !plan_id) {
    throw new BadRequest("Please provide all the required fields");
  }

  if (!mongoose.Types.ObjectId.isValid(plan_id)) throw new BadRequest("Invalid plan ID");
  if (!mongoose.Types.ObjectId.isValid(paymentmethod_id)) throw new BadRequest("Invalid payment method ID");

  const plan = await PlanModel.findById(plan_id);
  if (!plan) throw new NotFound("Plan not found");

  const parsedAmount = Number(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new BadRequest("Amount must be a positive number");
  }

  const validAmounts = [plan.price_monthly, plan.price_quarterly, plan.price_semi_annually, plan.price_annually]
    .filter(price => price != null);

  if (!validAmounts.includes(parsedAmount)) {
    throw new BadRequest("Invalid payment amount for this plan");
  }

  // حساب الخصم لو فيه كود
  let discountAmount = 0;
  if (code) {
    const today = new Date();
    const promo = await PromoCodeModel.findOne({
      code,
      isActive: true,
      start_date: { $lte: today },
      end_date: { $gte: today },
    });

    if (!promo) throw new BadRequest("Invalid or expired promo code");

    const alreadyUsed = await PromoCodeUserModel.findOne({ userId, codeId: promo._id });
    if (alreadyUsed) throw new BadRequest("You have already used this promo code");

    type SubscriptionType = "monthly" | "quarterly" | "semi_annually" | "yearly";
    const validSubscriptionTypes: SubscriptionType[] = ["monthly", "quarterly", "semi_annually", "yearly"];
    if (!validSubscriptionTypes.includes(subscriptionType)) {
      throw new BadRequest("Invalid subscription type");
    }

    const promoPlan = await PromoCodePlanModel.findOne({ codeId: promo._id, planId: plan._id });
    if (!promoPlan) throw new BadRequest("Promo code does not apply to this plan");

    const appliesToKey = `applies_to_${subscriptionType}` as keyof typeof promoPlan;
    if (!promoPlan[appliesToKey]) throw new BadRequest("Promo code does not apply to this plan/subscription type");

    if (promo.discount_type === "percentage") {
      discountAmount = (amount * promo.discount_value) / 100;
    } else {
      discountAmount = promo.discount_value;
    }

    await PromoCodeUserModel.create({ userId, codeId: promo._id });
  }

  const finalAmount = amount - discountAmount;
  if (finalAmount <= 0) throw new BadRequest("Invalid payment amount after applying promo code");

  // بناء رابط كامل للصورة لو مرفوعة
  let photoUrl: string | undefined;
  if (req.file) {
    photoUrl = `${req.protocol}://${req.get("host")}/uploads/payments/${req.file.filename}`;
  }

  const payment = await PaymentModel.create({
    amount: finalAmount,
    paymentmethod_id,
    plan_id,
    payment_date: new Date(),
    userId,
    status: "pending",
    code,
    photo: photoUrl, // رابط كامل للصورة
    subscriptionType,
  });

  SuccessResponse(res, {
    message: "Payment created successfully. Promo code applied (if valid).",
    payment,
    discountAmount,
  });
};
export const getAllPayments = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("user is not authenticated");

  const payments = await PaymentModel.find({ userId: req.user.id })
    .populate("paymentmethod_id")
    .populate("plan_id");    

  const pending = payments.filter(p => p.status === "pending");
  const history = payments.filter(p => ["approved", "rejected"].includes(p.status));

  SuccessResponse(res, {
    message: "All payments fetched successfully",
    payments: {
      pending,
      history,
    },
  });
};

export const getPaymentById = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("user is not authenticated");
  const userId = req.user.id;
  const { id } = req.params;

  if (!id) throw new BadRequest("Please provide payment id");

  const payment = await PaymentModel.findOne({ _id: id, userId })
    .populate("paymentmethod_id")
    .populate("plan_id"); // ✅ جبت تفاصيل البلان برضه

  if (!payment) throw new NotFound("Payment not found");

  SuccessResponse(res, { message: "Payment fetched successfully", payment });
};
