import { Request, Response } from 'express';
import { PromoCodeModel } from '../../models/shema/promo_code';
import { SuccessResponse } from '../../utils/response';
import { BadRequest } from '../../Errors/BadRequest';
import { NotFound } from '../../Errors/NotFound';
import { UnauthorizedError } from '../../Errors/unauthorizedError';
import { PromoCodePlanModel } from '../../models/shema/promocode_plans';

export const createPromoCodeWithPlans = async (req: Request, res: Response) => {
    if (!req.user|| req.user.role !== 'admin') throw new UnauthorizedError('access denied');
  const { promoCodeData, planLinks } = req.body;
  
  if (!promoCodeData || !planLinks) throw new BadRequest("Missing promo code data or plan links");

  const promoCode = await PromoCodeModel.create({
    ...promoCodeData,
    available_users: promoCodeData.maxusers
  });

  const plans = planLinks.map((link: any) => ({
    ...link,
    codeId: promoCode._id
  }));

  await PromoCodePlanModel.insertMany(plans);

  SuccessResponse(res, {
    message: "Promo code created with linked plans",
    promoCode
  });
};

export const getAllPromoCodesWithPlans = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== 'admin') throw new UnauthorizedError('access denied');

  const promos = await PromoCodeModel.find().lean().exec();

  const promosWithPlans = await Promise.all(
    promos.map(async (promo) => {
      const plans = await PromoCodePlanModel.find({ codeId: promo._id }).populate('planId').lean();

      // ✅ ظبط التواريخ
      const formattedPromo = {
        ...promo,
        start_date: promo.start_date ? new Date(promo.start_date).toISOString().split("T")[0] : null,
        end_date: promo.end_date ? new Date(promo.end_date).toISOString().split("T")[0] : null,
      };

      const formattedPlans = plans.map((plan) => {
  const p = plan as any; // أو as { start_date?: Date; end_date?: Date }
     return {
    ...p,
    start_date: p.start_date ? new Date(p.start_date).toISOString().split("T")[0] : null,
    end_date: p.end_date ? new Date(p.end_date).toISOString().split("T")[0] : null,
  };
});

      return { ...formattedPromo, plans: formattedPlans };
    })
  );

  SuccessResponse(res, { promos: promosWithPlans });
};

export const getPromoCodeWithPlansById = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== 'admin') throw new UnauthorizedError('access denied');

  const { id } = req.params;
  const promo = await PromoCodeModel.findById(id).populate('planId').lean();
  if (!promo) throw new NotFound("Promo code not found");

  const plans = await PromoCodePlanModel.find({ codeId: id }).lean();

  // ✅ ظبط التواريخ
  const formattedPromo = {
    ...promo,
    start_date: promo.start_date ? new Date(promo.start_date).toISOString().split("T")[0] : null,
    end_date: promo.end_date ? new Date(promo.end_date).toISOString().split("T")[0] : null,
  };

  const formattedPlans = plans.map((plan) => {
  const p = plan as any; // أو as { start_date?: Date; end_date?: Date }
  return {
    ...p,
    start_date: p.start_date ? new Date(p.start_date).toISOString().split("T")[0] : null,
    end_date: p.end_date ? new Date(p.end_date).toISOString().split("T")[0] : null,
  };
});

  SuccessResponse(res, { promo: formattedPromo, plans: formattedPlans });
};

export const updatePromoCodeWithPlans = async (req: Request, res: Response) => {
      if (!req.user|| req.user.role !== 'admin') throw new UnauthorizedError('access denied');
  
  const { id } = req.params;
  const { promoCodeData, planLinks } = req.body;

  const promo = await PromoCodeModel.findByIdAndUpdate(id, promoCodeData, { new: true });
  if (!promo) throw new NotFound("Promo code not found");

  // حذف الخطط القديمة المرتبطة
  await PromoCodePlanModel.deleteMany({ codeId: id });

  // إضافة الخطط الجديدة
  const plans = planLinks.map((link: any) => ({ ...link, codeId: promo._id }));
  await PromoCodePlanModel.insertMany(plans);

  SuccessResponse(res, { message: "Promo code and plans updated", promo });
};

export const deletePromoCodeWithPlans = async (req: Request, res: Response) => {
      if (!req.user|| req.user.role !== 'admin') throw new UnauthorizedError('access denied');
  
  const { id } = req.params;
  const promo = await PromoCodeModel.findByIdAndDelete(id);
  if (!promo) throw new NotFound("Promo code not found");

  await PromoCodePlanModel.deleteMany({ codeId: id });

  SuccessResponse(res, { message: "Promo code and linked plans deleted" });
};