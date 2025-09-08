import { Request, Response } from 'express';
import { SubscriptionModel } from '../../models/shema/subscriptions';
import { BadRequest } from '../../Errors/BadRequest';
import { NotFound } from '../../Errors/NotFound';
import { UnauthorizedError } from '../../Errors/unauthorizedError';
import { SuccessResponse } from '../../utils/response';


// export const  createSubscription = async (req: Request, res: Response) => {
//     if (!req.user) throw new UnauthorizedError('User not authenticated');
//     const userId = req.user.id;
//     const data = req.body;
//     if (!data) throw new BadRequest('Please provide all the required fields');
//     const { startDate, endDate } = data;
//     if (endDate <= startDate) throw new BadRequest('End date must be greater than start date');
//     const subscription = await SubscriptionModel.create({ ...data, userId });
//     SuccessResponse(res, { message: 'Subscription created successfully', subscription });
// };

export const getAllSubscriptions = async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError('User not authenticated');
    const userId = req.user.id;
    const subscriptions = await SubscriptionModel.find({ userId}).populate('planId').populate('PaymentId');
    if (!subscriptions) throw new NotFound('No subscriptions found');
    SuccessResponse(res, { message: 'All subscriptions fetched successfully', subscriptions });
}
export const getSubscriptionById = async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError('User not authenticated');
    const { id } = req.params;
    const subscription = await SubscriptionModel.findById(id).populate('planId').populate('PaymentId');
    if (!subscription) throw new NotFound('Subscription not found');
    SuccessResponse(res, { message: 'Subscription fetched successfully', subscription });
}

// export const deleteSubscription = async (req: Request, res: Response) => {
//     if (!req.user) throw new UnauthorizedError('User not authenticated');
//     const { id } = req.params;
//     if (!id) throw new BadRequest('Please provide subscription id');
//     const subscription = await SubscriptionModel.findByIdAndDelete(id);
//     if (!subscription) throw new NotFound('Subscription not found');
//     SuccessResponse(res, { message: 'Subscription canceled successfully' });
// }
 
// export const updateSubscription = async (req: Request, res: Response) => {
//     if (!req.user) throw new UnauthorizedError('User not authenticated');
//     const { id } = req.params;
//     if (!id) throw new BadRequest('Please provide subscription id');
//     const data = req.body;
//     const subscription = await SubscriptionModel.findByIdAndUpdate(id, { ...data }, { new: true });
//     if (!subscription) throw new NotFound('Subscription not found');
//     SuccessResponse(res, { message: 'Subscription updated successfully', subscription });
// }   
