import { Router } from "express";
import { getPromoCodeUser, getPromoCodeUserById } from "../../controller/admin/promocode_user"; 
import { catchAsync } from "../../utils/catchAsync";

const router = Router();
router.get('/' ,catchAsync(getPromoCodeUser));
router.get('/:id' ,catchAsync(getPromoCodeUserById));
export default router;
