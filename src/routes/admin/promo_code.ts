import { Router } from 'express';
import {createpromoCode,getAllPromoCode,getPromoCodeById,updatePromoCode,deletePromoCode} from '../../controller/admin/promo_code';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();

router.post('/', catchAsync(createpromoCode));
router.get('/', catchAsync(getAllPromoCode));
router.get('/:id', catchAsync(getPromoCodeById));
router.put('/:id', catchAsync(updatePromoCode));
router.delete('/:id', catchAsync(deletePromoCode));

export default router;