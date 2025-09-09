"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const promocode_plans_1 = require("../../controller/users/promocode_plans");
const catchAsync_1 = require("../../utils/catchAsync");
const router = (0, express_1.Router)();
router.get('/', (0, catchAsync_1.catchAsync)(promocode_plans_1.getPromoCodePlans));
router.get('/:id', (0, catchAsync_1.catchAsync)(promocode_plans_1.getPromoCodePlanById));
exports.default = router;
