import {Router} from "express";
import {createTemplate,updateTemplate,getAllTemplates,getTemplateById ,deleteTemplate}from"../../controller/admin/template";
import { uploadTemplate } from "../../utils/Multer";
import { catchAsync } from "../../utils/catchAsync";
const router =Router();

router.post("/",  uploadTemplate.fields([
    { name: "template_file_path", maxCount: 1 },
    { name: "photo", maxCount:  1 },
  ]), catchAsync(createTemplate));
router.get("/", catchAsync(getAllTemplates));
router.get("/:id", catchAsync(getTemplateById));
router.put("/:id",  uploadTemplate.fields([
    { name: "template_file_path", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]), catchAsync(updateTemplate));
router.delete("/:id", catchAsync(deleteTemplate));

export default router;