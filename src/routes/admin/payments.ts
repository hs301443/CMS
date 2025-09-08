import { Router } from 'express';
import { getPaymentByIdAdmin,getAllPaymentsAdmin,updatePayment} from '../../controller/admin/payments';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();

router.get('/', catchAsync(getAllPaymentsAdmin));
router.get('/:id', catchAsync(getPaymentByIdAdmin));
router.put('/:id', catchAsync(updatePayment));

export default router;