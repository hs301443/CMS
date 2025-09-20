"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const template_1 = require("../../controller/users/template");
const catchAsync_1 = require("../../utils/catchAsync");
const router = (0, express_1.Router)();
router.get('/', (0, catchAsync_1.catchAsync)(template_1.getAllTemplates));
router.get('/:id', (0, catchAsync_1.catchAsync)(template_1.getTemplateById));
exports.default = router;
