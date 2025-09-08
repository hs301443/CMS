import { Router } from 'express';
import { createPayment, getAllPayments, getPaymentById } from '../../controller/users/payments';
import { catchAsync } from '../../utils/catchAsync';
import { authenticated } from '../../middlewares/authenticated';
const router = Router();
router.post('/', authenticated, catchAsync(createPayment));
router.get('/', authenticated, catchAsync(getAllPayments));
router.get('/:id', authenticated, catchAsync(getPaymentById));
export default router;
