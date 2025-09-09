"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const template_1 = require("../../controller/admin/template");
const Multer_1 = require("../../utils/Multer");
const catchAsync_1 = require("../../utils/catchAsync");
const router = (0, express_1.Router)();
router.post("/", Multer_1.uploadTemplate.fields([
    { name: "template_file_path", maxCount: 1 },
    { name: "photo", maxCount: 1 },
]), (0, catchAsync_1.catchAsync)(template_1.createTemplate));
router.get("/", (0, catchAsync_1.catchAsync)(template_1.getAllTemplates));
router.get("/:id", (0, catchAsync_1.catchAsync)(template_1.getTemplateById));
router.patch("/:id", Multer_1.uploadTemplate.fields([
    { name: "template_file_path", maxCount: 1 },
    { name: "photo", maxCount: 1 },
]), (0, catchAsync_1.catchAsync)(template_1.updateTemplate));
router.delete("/:id", (0, catchAsync_1.catchAsync)(template_1.deleteTemplate));
exports.default = router;
