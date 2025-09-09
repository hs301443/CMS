import { Router } from 'express';
import { getPromoCodePlanById,getPromoCodePlans }
 from '../../controller/users/promocode_plans';
import { catchAsync } from '../../utils/catchAsync';
import { authenticated } from '../../middlewares/authenticated';

const router = Router();

router.get('/', authenticated,catchAsync(getPromoCodePlans));
router.get('/:id',authenticated, catchAsync(getPromoCodePlanById));

export default router;