import { Router } from 'express';
import {getAllTemplates,getTemplateById} from '../../controller/users/template';
import { catchAsync } from '../../utils/catchAsync';
import { authenticated } from '../../middlewares/authenticated';

const router = Router();
router.get('/',authenticated ,catchAsync(getAllTemplates));
router.get('/:id',authenticated ,catchAsync(getTemplateById));
export default router;

