import {Router} from "express";
import {createTemplate,updateTemplate,getAllTemplates,getTemplateById ,deleteTemplate}from"../../controller/admin/template";
import { uploadTemplate } from "../../utils/Multer";
const router =Router();

router.post("/", uploadTemplate.single("template_file"), createTemplate);
router.get("/", getAllTemplates);
router.get("/:id", getTemplateById);
router.patch("/:id", uploadTemplate.single("template_file"), updateTemplate);
router.delete("/:id", deleteTemplate);

export default router;