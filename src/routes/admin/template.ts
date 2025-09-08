import {Router} from "express";
import {createTemplate,updateTemplate,getAllTemplates,getTemplateById ,deleteTemplate}from"../../controller/admin/template";
import { upload } from "../../utils/Multer";
const router =Router();

router.post("/", upload.single("template_file"), createTemplate);
router.get("/", getAllTemplates);
router.get("/:id", getTemplateById);
router.patch("/:id", upload.single("template_file"), updateTemplate);
router.delete("/:id", deleteTemplate);

export default router;