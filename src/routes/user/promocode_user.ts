import { Router } from "express";
import { getPromoCodeUserById, getPromoCodeUser } from "../../controller/users/promocode_user"; 
import { catchAsync } from "../../utils/catchAsync";
import { authenticated } from "../../middlewares/authenticated";

const router = Router();
router.get('/',authenticated ,catchAsync(getPromoCodeUser));
router.get('/:id',authenticated ,catchAsync(getPromoCodeUserById));
export default router;
