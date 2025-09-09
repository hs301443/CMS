import { Router } from 'express';
import { getAllPromoCodePlan, getPromoCodePlanById, createPromoCodePLan, updatePromoCodePlan, deletePromoCodePlan }
 from '../../controller/admin/promocode_plans';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();

router.get('/', catchAsync(getAllPromoCodePlan));
router.get('/:id', catchAsync(getPromoCodePlanById));
router.post('/', catchAsync(createPromoCodePLan));
router.put('/:id', catchAsync(updatePromoCodePlan));
router.delete('/:id', catchAsync(deletePromoCodePlan));

export default router;