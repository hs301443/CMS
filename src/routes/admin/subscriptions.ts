import { Router } from 'express';
import {  getAllSubscription, getSubscriptionById  } from '../../controller/admin/subscriptions';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();
router.get('/', catchAsync(getAllSubscription));
router.get('/:id', catchAsync(getSubscriptionById));

export default router;