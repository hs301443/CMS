import { Router } from 'express';
import {createWebsite,deleteWebsite,getAllWebsites,getWebsiteById, updateWebsite  } from '../../controller/users/Websites';
import { catchAsync } from '../../utils/catchAsync';
import { authenticated } from '../../middlewares/authenticated';
import { uploadWebsite } from '../../utils/Multer';
const router = Router();
router.post('/', authenticated, uploadWebsite.single("project_path"), catchAsync(createWebsite));
router.get('/', authenticated, catchAsync(getAllWebsites));
router.get('/:id', authenticated, catchAsync(getWebsiteById));
router.delete('/:websiteId', authenticated, catchAsync(deleteWebsite));
router.put('/:websiteId', authenticated, uploadWebsite.single("project_path"), catchAsync(updateWebsite));

export default router;
