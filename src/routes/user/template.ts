import { Router } from 'express';
import {getAllTemplates,getTemplateById} from '../../controller/users/template';
import { catchAsync } from '../../utils/catchAsync';
import { authenticated } from '../../middlewares/authenticated';

const router = Router();
router.get('/' ,catchAsync(getAllTemplates));
router.get('/:id' ,catchAsync(getTemplateById));
export default router;

