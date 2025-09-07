import { Request, Response } from 'express';
import { PlanModel } from '../../models/shema/plans';
import { SuccessResponse } from '../../utils/response';
import { BadRequest } from '../../Errors/BadRequest';
import { NotFound } from '../../Errors/NotFound';

export const getAllPlans = async (req: Request, res: Response) => {
  const plans = await PlanModel.find();
    SuccessResponse(res, {  message: 'All plans fetched successfully',plans });
};

export const getPlanById = async (req: Request, res: Response) => {
   const { id } = req.params;
    if (!id) throw new BadRequest('Please provide plan id');
    const plan = await PlanModel.findById(id);
    if (!plan) throw new NotFound('Plan not found');
    SuccessResponse(res, {  message: 'Plan fetched successfully' ,plan});
}