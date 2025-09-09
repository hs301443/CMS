import { Request, Response } from 'express';
import { PromoCodePlanModel } from '../../models/shema/promocode_plans';
import { SuccessResponse } from '../../utils/response';
import { BadRequest } from '../../Errors/BadRequest';
import { NotFound } from '../../Errors/NotFound';
import { UnauthorizedError } from '../../Errors/unauthorizedError';

export const createPromoCodePLan = async (req: Request, res: Response) => {
    if(!req.user|| req.user.role !=='admin') throw new UnauthorizedError('access denied');
    const {planId,promocodeId}=req.body;
    if(!planId||!promocodeId) throw new BadRequest('Please provide all the required fields');
    if(promocodeId.end_date()>new Date()) throw new BadRequest('Promo code is not expired');
    const data = await PromoCodePlanModel.create({planId,promocodeId});
    SuccessResponse(res, { message: 'Promo Code Plan created successfully', data });
};

export const getPromoCodePlanById = async (req: Request, res: Response) => {
    if(!req.user|| req.user.role !=='admin') throw new UnauthorizedError('access denied');
    const { id } = req.params;
    if (!id) throw new BadRequest('Please provide Promo Code Plan id');
    const data = await PromoCodePlanModel.findById(id);
    if (!data) throw new NotFound('Promo Code Plan not found');
    SuccessResponse(res, { message: 'Promo Code Plan fetched successfully', data });
};

export const getAllPromoCodePlan = async (req: Request, res: Response) => {
    if(!req.user|| req.user.role !=='admin') throw new UnauthorizedError('access denied');
    const data = await PromoCodePlanModel.find();
    if (!data) throw new NotFound('No Promo Code Plan found');
    SuccessResponse(res, { message: 'All Promo Code Plan fetched successfully', data });
};

export const deletePromoCodePlan = async (req: Request, res: Response) => {
    if(!req.user|| req.user.role !=='admin') throw new UnauthorizedError('access denied');
    const { id } = req.params;
    if (!id) throw new BadRequest('Please provide Promo Code Plan id');
    const data = await PromoCodePlanModel.findByIdAndDelete(id);
    if (!data) throw new NotFound('Promo Code Plan not found');
    SuccessResponse(res, { message: 'Promo Code Plan deleted successfully' });
};

export const updatePromoCodePlan = async (req: Request, res: Response) => {
    if(!req.user|| req.user.role !=='admin') throw new UnauthorizedError('access denied');
    const { id } = req.params;
    if (!id) throw new BadRequest('Please provide Promo Code Plan id');
    const data = req.body;
    const promocode = await PromoCodePlanModel.findByIdAndUpdate(id, { ...data }, { new: true });
    if (!promocode) throw new NotFound('Promo Code Plan not found');
    SuccessResponse(res, { message: 'Promo Code Plan updated successfully', promocode });
};

