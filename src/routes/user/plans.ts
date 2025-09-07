import { Router } from 'express';
import { getAllPlans, getPlanById } from '../../controller/users/plans';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();
router.get('/', catchAsync(getAllPlans));
router.get('/:id', catchAsync(getPlanById));

export default router;