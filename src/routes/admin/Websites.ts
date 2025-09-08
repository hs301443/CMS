import { Router } from 'express';
import {updateWebsiteStatus,getAllWebsites,getWebsiteById  } from '../../controller/admin/Websites';
import { catchAsync } from '../../utils/catchAsync';
import { authenticated } from '../../middlewares/authenticated';

const router = Router();
router.put('/:id', authenticated, catchAsync(updateWebsiteStatus));
router.get('/', authenticated, catchAsync(getAllWebsites));
router.get('/:id', authenticated, catchAsync(getWebsiteById));
export default router;
