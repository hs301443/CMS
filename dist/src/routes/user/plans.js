"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const plans_1 = require("../../controller/users/plans");
const catchAsync_1 = require("../../utils/catchAsync");
const router = (0, express_1.Router)();
router.get('/', (0, catchAsync_1.catchAsync)(plans_1.getAllPlans));
router.get('/:id', (0, catchAsync_1.catchAsync)(plans_1.getPlanById));
exports.default = router;
