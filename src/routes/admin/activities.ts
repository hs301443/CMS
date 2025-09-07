import { Router } from "express";
import { createActivity, deleteActivity, getActivityById, getAllActivities, updateActivity } from "../../controller/admin/activities";
import { validate } from "../../middlewares/validation";
import { createActivitySchema, updateActivitySchema } from "../../validation/admin/activities";

const router = Router();
router.post("/", validate(createActivitySchema), createActivity);
router.get("/", getAllActivities);
router.get("/:id", getActivityById);
router.put("/:id", validate(updateActivitySchema), updateActivity);
router.delete("/:id", deleteActivity);
export default router;