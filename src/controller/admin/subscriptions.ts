import { Request, Response } from 'express';
import { SubscriptionModel } from '../../models/shema/subscriptions';
import { BadRequest } from '../../Errors/BadRequest';
import { NotFound } from '../../Errors/NotFound';
import { UnauthorizedError } from '../../Errors/unauthorizedError';
import { SuccessResponse } from '../../utils/response';


export const  getAllSubscription = async (req: Request, res: Response) => {
    if (!req.user|| req.user.role !== 'admin') throw new UnauthorizedError('User not authenticated');
    const data = await SubscriptionModel.find().populate('userId').populate('planId').populate('PaymentId');
    if (!data) throw new NotFound('No subscription found');
    SuccessResponse(res, { message: 'All subscription fetched successfully', data });
}
export const getSubscriptionById = async (req: Request, res: Response) => {
    if (!req.user|| req.user.role !== 'admin') throw new UnauthorizedError('User not authenticated');
    const { id } = req.params;
    if (!id) throw new BadRequest('Please provide subscription id');
    const data = await SubscriptionModel.findById(id).populate('userId').populate('planId').populate('PaymentId');
    if (!data) throw new NotFound('Subscription not found');
    SuccessResponse(res, { message: 'Subscription fetched successfully', data });
}
