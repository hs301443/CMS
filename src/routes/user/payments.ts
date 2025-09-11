import { Router } from 'express';
import { createPayment, getAllPayments, getPaymentById } from '../../controller/users/payments';
import { catchAsync } from '../../utils/catchAsync';
import { authenticated } from '../../middlewares/authenticated';
import { uploadLogo } from '../../utils/Multer';
const router = Router();
router.post('/', authenticated,uploadLogo.single("photo"), catchAsync(createPayment));
router.get('/', authenticated, catchAsync(getAllPayments));
router.get('/:id', authenticated, catchAsync(getPaymentById));
export default router;

