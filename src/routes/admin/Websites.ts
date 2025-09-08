import { Router } from 'express';
import {updateWebsiteStatus,getAllWebsites,getWebsiteById  } from '../../controller/admin/Websites';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();
router.put('/:id', catchAsync(updateWebsiteStatus));
router.get('/', catchAsync(getAllWebsites));
router.get('/:id', catchAsync(getWebsiteById));
export default router;
