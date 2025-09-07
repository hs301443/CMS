import { Request, Response } from 'express';
import { PaymentMethodModel } from '../../models/shema/payment_methods';
import { BadRequest } from '../../Errors/BadRequest';
import { NotFound } from '../../Errors/NotFound';
import { UnauthorizedError } from '../../Errors/unauthorizedError';
import { SuccessResponse } from '../../utils/response';
import { SubscriptionModel } from '../../models/shema/subscriptions';
import { PaymentModel } from '../../models/shema/payments';

export const createPayment = async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError("user is not authenticated");
    const userId = req.user.id;
    const {  amount, paymentMethodId } = req.body;
    if (!amount || !paymentMethodId) throw new BadRequest('Please provide all the required fields');
    const paymentMethod = await PaymentModel.create({  amount, paymentMethodId, userId , status: 'pending' });
    SuccessResponse(res, { message: 'Payment created successfully', paymentMethod });
}
export const getAllPayments = async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError("user is not authenticated");
    const userId = req.user.id; 
    const payments = await PaymentModel.find({ userId }).populate('paymentmethod_id')
    SuccessResponse(res, { message: 'All payments fetched successfully', payments });
}
export const getPaymentById = async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError("user is not authenticated");
    const userId = req.user.id;
    const { id } = req.params;
    if (!id) throw new BadRequest('Please provide payment id');
    const payment = await PaymentModel.findOne({ _id: id, userId }).populate('paymentmethod_id');
    if (!payment) throw new NotFound('Payment not found');
    SuccessResponse(res, { message: 'Payment fetched successfully', payment });
}   
export const getSubscriptionPayments = async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError("user is not authenticated");
    const userId = req.user.id;
    const { subscriptionId } = req.params;
    if (!subscriptionId) throw new BadRequest('Please provide subscription id');
    const subscription = await SubscriptionModel.findOne({ _id: subscriptionId, userId });
    if (!subscription) throw new NotFound('Subscription not found');
    const payments = await PaymentModel.find({ subscription_id: subscriptionId, userId }).populate('paymentmethod_id');
    SuccessResponse(res, { message: 'All payments for the subscription fetched successfully', payments });
}