import { Request, Response } from 'express';
import { PromoCodeUserModel  } from '../../models/shema/promocode_users';
import { BadRequest } from '../../Errors/BadRequest';
import { NotFound } from '../../Errors/NotFound';
import { UnauthorizedError } from '../../Errors/unauthorizedError';
import { SuccessResponse } from '../../utils/response';

export const getPromoCodeUser = async (req: Request, res: Response) => {

    if (!req.user|| req.user.role !== 'admin') throw new UnauthorizedError('access denied');
    const promocode = await PromoCodeUserModel.find().populate('userId', 'name email').populate('codeId');
    if(!promocode) throw new NotFound('Promocode not found');
    SuccessResponse(res, { message: 'Promocode found successfully', promocode });
}

export const getPromoCodeUserById =async (req: Request, res: Response) => {

    if (!req.user|| req.user.role !== 'admin') throw new UnauthorizedError('access denied');
    const {id} = req.params;
    if(!id) throw new BadRequest('Please provide promocode id');
    const promocode = await PromoCodeUserModel.findById(id).populate('userId', 'name email').populate('codeId');
    if(!promocode) throw new NotFound('Promocode not found');
    SuccessResponse(res, { message: 'Promocode found successfully', promocode });
}

