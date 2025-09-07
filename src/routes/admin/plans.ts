import { Router } from 'express';
import { createPlan, getAllPlans, getPlanById, updatePlan, deletePlan } from '../../controller/admin/plans';
import { catchAsync } from '../../utils/catchAsync';
import { validate } from '../../middlewares/validation';
import { CreateplanSchema, UpdateplanSchema } from '../../validation/admin/plans';
const router = Router();

router.post('/', validate(CreateplanSchema), catchAsync(createPlan));
router.get('/', catchAsync(getAllPlans));
router.get('/:id', catchAsync(getPlanById));
router.put('/:id', validate(UpdateplanSchema), catchAsync(updatePlan));
router.delete('/:id', catchAsync(deletePlan));

export default router;