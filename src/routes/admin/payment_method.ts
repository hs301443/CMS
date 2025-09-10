import { Router } from 'express';
import { createPaymentMethod, getAllPaymentMethods, getPaymentMethodById, updatePaymentMethod, deletePaymentMethod } from '../../controller/admin/payment_method';
import { catchAsync } from '../../utils/catchAsync';
import { validate } from '../../middlewares/validation';
import { CreatePaymentMethodSchema, UpdatePaymentMethodSchema } from '../../validation/admin/payment_method';
import { uploadLogo } from '../../utils/Multer';


const router = Router();
router.post('/', validate(CreatePaymentMethodSchema),uploadLogo.single("logo"), catchAsync(createPaymentMethod));
router.get('/', catchAsync(getAllPaymentMethods));
router.get('/:id', catchAsync(getPaymentMethodById));
router.put('/:id', validate(UpdatePaymentMethodSchema),uploadLogo.single("logo") ,catchAsync(updatePaymentMethod));
router.delete('/:id', catchAsync(deletePaymentMethod));
export default router;