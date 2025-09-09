import { Request, Response } from 'express';
import { PromoCodePlanModel } from '../../models/shema/promocode_plans';
import { SuccessResponse } from '../../utils/response';
import { BadRequest } from '../../Errors/BadRequest';
import { NotFound } from '../../Errors/NotFound';
import { UnauthorizedError } from '../../Errors/unauthorizedError';

export const getPromoCodePlans = async (req: Request, res: Response) => {
    const data = await PromoCodePlanModel.find();
    if (!data) throw new NotFound('Promo Code Plan not found');
    SuccessResponse(res, { message: 'Promo Code Plan fetched successfully', data });
};

export const getPromoCodePlanById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new BadRequest('Please provide Promo Code Plan id');
    const data = await PromoCodePlanModel.findById(id);
    if (!data) throw new NotFound('Promo Code Plan not found');
    SuccessResponse(res, { message: 'Promo Code Plan fetched successfully', data });
};