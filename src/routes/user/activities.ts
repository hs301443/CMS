import { Router } from "express";
import{getActivityById,getAllActivities}from "../../controller/users/activities"
import { authenticated } from "../../middlewares/authenticated";
const router = Router();

router.get("/",authenticated,getAllActivities);
router.get("/:id",authenticated,getActivityById);
export default router;
