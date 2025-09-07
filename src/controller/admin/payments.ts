import { Request, Response } from 'express';
import { PaymentMethodModel } from '../../models/shema/payment_methods';
import { BadRequest } from '../../Errors/BadRequest';
import { NotFound } from '../../Errors/NotFound';
import { UnauthorizedError } from '../../Errors/unauthorizedError';
import { SuccessResponse } from '../../utils/response';
import { SubscriptionModel } from '../../models/shema/subscriptions';
import { PaymentModel } from '../../models/shema/payments';
import { PlanModel } from '../../models/shema/plans';

export const getAllPayment = async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");

    const paymentMethods = await PaymentModel.find();
    if (!paymentMethods) throw new NotFound('No payment methods found');
    SuccessResponse(res, { message: 'All payment methods fetched successfully', paymentMethods });
}
export const getPaymentById = async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id) throw new BadRequest('Please provide payment method id');
    const paymentMethod = await PaymentModel.findById(id);
    if (!paymentMethod) throw new NotFound('Payment method not found');
    SuccessResponse(res, { message: 'Payment method fetched successfully', paymentMethod });
}

export const updatePayment = async (req: Request, res: Response) => {

    if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");

    const { id } = req.params;
    if (!id) throw new BadRequest('Please provide payment method id');
    const {status,rejected_reason}= req.body;
    const payment = await PaymentModel.findById(id);
    if (!payment) throw new NotFound('Payment  not found');
    
    if(status==="rejected"&&rejected_reason){
        payment.rejected_reason=rejected_reason;
    }
    await payment.save();
    if (status === "approved") {
        const plan = await PlanModel.findById(payment.get('planId') || req.body.planId)
        if(!plan) throw new NotFound('plan not found')
    }

}