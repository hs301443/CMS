import { Request, Response } from 'express';
import { PaymentMethodModel } from '../../models/shema/payment_methods';
import { BadRequest } from '../../Errors/BadRequest';
import { NotFound } from '../../Errors/NotFound';
import { UnauthorizedError } from '../../Errors/unauthorizedError';
import { SuccessResponse } from '../../utils/response';
import { SubscriptionModel } from '../../models/shema/subscriptions';
import { PaymentModel } from '../../models/shema/payments';
import { PlanModel } from '../../models/shema/plans';

export const createPayment = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("User is not authenticated");

  const userId = req.user.id;
  const { plan_id, paymentmethod_id, amount } = req.body;

  if (!amount || !paymentmethod_id || !plan_id) {
    throw new BadRequest("Please provide all the required fields");
  }

  const plan = await PlanModel.findById(plan_id);
  if (!plan) throw new NotFound("Plan not found");

  const validAmounts = [
    plan.price_quarterly,
    plan.price_semi_annually,
    plan.price_annually,
  ].filter((price) => price !== undefined && price !== null); 

  if (!validAmounts.includes(amount)) {
    throw new BadRequest("Invalid payment amount for this plan");
  }

  const payment = await PaymentModel.create({
    amount,
    paymentmethod_id,
    plan_id,
    payment_date: new Date(),
    userId,
    status: "pending",
  });

  SuccessResponse(res, {
    message: "Payment created successfully",
    payment,
  });
};

export const getAllPayments = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("user is not authenticated");

  const payments = await PaymentModel.find({ userId: req.user.id })
    .populate("paymentmethod_id")
    .populate("plan_id"); // ✅ هنا جبنا تفاصيل البلان كمان

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
