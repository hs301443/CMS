"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const promocode_user_1 = require("../../controller/admin/promocode_user");
const catchAsync_1 = require("../../utils/catchAsync");
const router = (0, express_1.Router)();
router.get('/', (0, catchAsync_1.catchAsync)(promocode_user_1.getPromoCodeUser));
router.get('/:id', (0, catchAsync_1.catchAsync)(promocode_user_1.getPromoCodeUserById));
exports.default = router;
