import { Router } from 'express';
import {  getAllPaymentMethods, getPaymentMethodById } from '../../controller/users/payment_method';
import { catchAsync } from '../../utils/catchAsync';
import { authenticated } from '../../middlewares/authenticated';
const router = Router();
router.get('/',authenticated ,catchAsync(getAllPaymentMethods));
router.get('/:id',authenticated ,catchAsync(getPaymentMethodById));
export default router;