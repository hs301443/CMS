"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptionById = exports.getAllSubscriptions = void 0;
const subscriptions_1 = require("../../models/shema/subscriptions");
const NotFound_1 = require("../../Errors/NotFound");
const unauthorizedError_1 = require("../../Errors/unauthorizedError");
const response_1 = require("../../utils/response");
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
const getAllSubscriptions = async (req, res) => {
    if (!req.user)
        throw new unauthorizedError_1.UnauthorizedError('User not authenticated');
    const userId = req.user.id;
    const subscriptions = await subscriptions_1.SubscriptionModel.find({ userId }).populate('planId').populate('PaymentId');
    if (!subscriptions)
        throw new NotFound_1.NotFound('No subscriptions found');
    (0, response_1.SuccessResponse)(res, { message: 'All subscriptions fetched successfully', subscriptions });
};
exports.getAllSubscriptions = getAllSubscriptions;
const getSubscriptionById = async (req, res) => {
    if (!req.user)
        throw new unauthorizedError_1.UnauthorizedError('User not authenticated');
    const { id } = req.params;
    const subscription = await subscriptions_1.SubscriptionModel.findById(id).populate('planId').populate('PaymentId');
    if (!subscription)
        throw new NotFound_1.NotFound('Subscription not found');
    (0, response_1.SuccessResponse)(res, { message: 'Subscription fetched successfully', subscription });
};
exports.getSubscriptionById = getSubscriptionById;
