import { Router } from 'express';
import { getPromoCodePlanById,getPromoCodePlans }
 from '../../controller/users/promocode_plans';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();

router.get('/', catchAsync(getPromoCodePlans));
router.get('/:id', catchAsync(getPromoCodePlanById));

export default router;