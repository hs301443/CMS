import { Request, Response } from 'express';
import { PromoCodeModel } from '../../models/shema/promo_code';
import { SuccessResponse } from '../../utils/response';
import { BadRequest } from '../../Errors/BadRequest';
import { NotFound } from '../../Errors/NotFound';
import { UnauthorizedError } from '../../Errors/unauthorizedError';

export const createpromoCode=async(req: Request, res: Response) => {
    if (!req.user|| req.user.role !== 'admin') throw new UnauthorizedError('access denied');
    const data = req.body;
    if (!data) throw new BadRequest('Please provide all the required fields');
    const promocode = await PromoCodeModel.create(data);
    SuccessResponse(res, { message: 'Promo Code created successfully', promocode });
}

export const getAllPromoCode=async(req: Request, res: Response) => {
    if (!req.user|| req.user.role !== 'admin') throw new UnauthorizedError('access denied');
    const data = await PromoCodeModel.find();
    if (!data) throw new NotFound('No Promo Code found');
    SuccessResponse(res, { message: 'All Promo Code fetched successfully', data });
}

export const getPromoCodeById=async(req: Request, res: Response) => {
    if (!req.user|| req.user.role !== 'admin') throw new UnauthorizedError('access denied');
    const { id } = req.params;
    if (!id) throw new BadRequest('Please provide Promo Code id');
    const data = await PromoCodeModel.findById(id);
    if (!data) throw new NotFound('Promo Code not found');
    SuccessResponse(res, { message: 'Promo Code fetched successfully', data });
}

export const updatePromoCode=async(req: Request, res: Response) => {
    if (!req.user|| req.user.role !== 'admin') throw new UnauthorizedError('access denied');
    const { id } = req.params;
    if (!id) throw new BadRequest('Please provide Promo Code id');
    const data = req.body;
    const promocode = await PromoCodeModel.findByIdAndUpdate(id, { ...data }, { new: true });
    if (!promocode) throw new NotFound('Promo Code not found');
    SuccessResponse(res, { message: 'Promo Code updated successfully', promocode });
}

export const deletePromoCode=async(req: Request, res: Response) => {
    if (!req.user|| req.user.role !== 'admin') throw new UnauthorizedError('access denied');
    const { id } = req.params;
    if (!id) throw new BadRequest('Please provide Promo Code id');
    const promocode = await PromoCodeModel.findByIdAndDelete(id);
    if (!promocode) throw new NotFound('Promo Code not found');
    SuccessResponse(res, { message: 'Promo Code deleted successfully' });
}
