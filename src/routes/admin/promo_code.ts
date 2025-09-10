import { Router } from 'express';
import {createPromoCodeWithPlans,updatePromoCodeWithPlans,getAllPromoCodesWithPlans,getPromoCodeWithPlansById,deletePromoCodeWithPlans} from '../../controller/admin/promo_code';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();

router.post('/', catchAsync(createPromoCodeWithPlans));
router.get('/', catchAsync(getAllPromoCodesWithPlans));
router.get('/:id', catchAsync(getPromoCodeWithPlansById));
router.put('/:id', catchAsync(updatePromoCodeWithPlans));
router.delete('/:id', catchAsync(deletePromoCodeWithPlans));

export default router;