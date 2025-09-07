import { Request, Response } from 'express';
import { PaymentMethodModel } from '../../models/shema/payment_methods';
import { BadRequest } from '../../Errors/BadRequest';
import { NotFound } from '../../Errors/NotFound';
import { UnauthorizedError } from '../../Errors/unauthorizedError';
import { SuccessResponse } from '../../utils/response';

export const createPaymentMethod = async (req: Request, res: Response) => {
      if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");

    const data= req.body;
    if (!data) throw new BadRequest('Please provide all the required fields');
    const paymentMethod = await PaymentMethodModel.create({ ...data });
    SuccessResponse(res, { message: 'Payment method created successfully', paymentMethod });
}

export const getAllPaymentMethods = async (req: Request, res: Response) => {
      if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");

        const paymentMethods = await PaymentMethodModel.find();
    if (!paymentMethods) throw new NotFound('No payment methods found');
    SuccessResponse(res, { message: 'All payment methods fetched successfully', paymentMethods });
}

export const getPaymentMethodById = async (req: Request, res: Response) => {
      if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");

        const { id } = req.params;
    if (!id) throw new BadRequest('Please provide payment method id');
    const paymentMethod = await PaymentMethodModel.findById(id);
    if (!paymentMethod) throw new NotFound('Payment method not found');
    SuccessResponse(res, { message: 'Payment method fetched successfully', paymentMethod });
}

export const updatePaymentMethod = async (req: Request, res: Response) => {
         if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");


    const { id } = req.params;
    if (!id) throw new BadRequest('Please provide payment method id');
    const data= req.body;
    const paymentMethod = await PaymentMethodModel.findByIdAndUpdate(id, { ...data }, { new: true });
    if (!paymentMethod) throw new NotFound('Payment method not found');
    SuccessResponse(res, { message: 'Payment method updated successfully', paymentMethod });
}

export const deletePaymentMethod = async (req: Request, res: Response) => {
      if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");

    const { id } = req.params;
    if (!id) throw new BadRequest('Please provide payment method id');
    const paymentMethod = await PaymentMethodModel.findByIdAndDelete(id);
    if (!paymentMethod) throw new NotFound('Payment method not found');
    SuccessResponse(res, { message: 'Payment method deleted successfully' });
}
