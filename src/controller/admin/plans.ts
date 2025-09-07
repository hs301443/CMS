import { Request, Response } from 'express';
import { PlanModel } from '../../models/shema/plans';
import { SuccessResponse } from '../../utils/response';
import { BadRequest } from '../../Errors/BadRequest';
import { NotFound } from '../../Errors/NotFound';
import { UnauthorizedError } from '../../Errors/unauthorizedError';

export const createPlan = async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");

   const { name, price_quarterly, price_semi_annually, price_annually, website_limit } = req.body;
   if(!name || !price_quarterly || !price_semi_annually || !price_annually || !website_limit) throw new BadRequest('Please provide all the required fields');
   const plan = await PlanModel.create({ name, price_quarterly, price_semi_annually, price_annually, website_limit });
     SuccessResponse(res, { message: 'Plan created successfully',plan })
};

export const getAllPlans = async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");
    const plans = await PlanModel.find();
    SuccessResponse(res, {  message: 'All plans fetched successfully',plans });
};

export const getPlanById = async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id) throw new BadRequest('Please provide plan id');
    const plan = await PlanModel.findById(id);
    if (!plan) throw new NotFound('Plan not found');
    SuccessResponse(res, { message: 'Plan fetched successfully',plan});
}

export const updatePlan = async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id) throw new BadRequest('Please provide plan id');
    const { name, price_quarterly, price_semi_annually, price_annually, website_limit } = req.body;
    const plan = await PlanModel.findByIdAndUpdate(id, { name, price_quarterly, price_semi_annually, price_annually, website_limit }, { new: true });
    if (!plan) throw new NotFound('Plan not found');
    SuccessResponse(res, {  message: 'Plan updated successfully',plan });
}

export const deletePlan = async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id) throw new BadRequest('Please provide plan id');
    const plan = await PlanModel.findByIdAndDelete(id);
    if (!plan) throw new NotFound('Plan not found');
    SuccessResponse(res, { message: 'Plan deleted successfully' });
}