import { Router } from 'express';
import { 
  createPaymentMethod, 
  getAllPaymentMethods, 
  getPaymentMethodById, 
  updatePaymentMethod, 
  deletePaymentMethod 
} from '../../controller/admin/payment_method';
import { catchAsync } from '../../utils/catchAsync';
import { validate } from '../../middlewares/validation';
import { CreatePaymentMethodSchema, UpdatePaymentMethodSchema } from '../../validation/admin/payment_method';
import { uploadLogo } from '../../utils/Multer';

const router = Router();

// إنشاء طريقة دفع جديدة مع رفع اللوجو والتحقق من صحة البيانات
router.post(
  '/',
  validate(CreatePaymentMethodSchema),
  uploadLogo.single("logo"),
  catchAsync(createPaymentMethod)
);

// الحصول على جميع طرق الدفع
router.get('/', catchAsync(getAllPaymentMethods));

// الحصول على طريقة دفع واحدة بواسطة الـ ID
router.get('/:id', catchAsync(getPaymentMethodById));

// تحديث طريقة الدفع مع رفع لوجو جديد إذا تم إرساله والتحقق من صحة البيانات
router.put(
  '/:id',
  validate(UpdatePaymentMethodSchema),
  uploadLogo.single("logo"),
  catchAsync(updatePaymentMethod)
);

// حذف طريقة دفع
router.delete('/:id', catchAsync(deletePaymentMethod));

export default router;
