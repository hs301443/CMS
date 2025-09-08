import { Router } from 'express';
import {createWebsite,getAllWebsites,getWebsiteById  } from '../../controller/users/Websites';
import { catchAsync } from '../../utils/catchAsync';
import { authenticated } from '../../middlewares/authenticated';

const router = Router();
router.post('/', authenticated, catchAsync(createWebsite));
router.get('/', authenticated, catchAsync(getAllWebsites));
router.get('/:id', authenticated, catchAsync(getWebsiteById));
export default router;
