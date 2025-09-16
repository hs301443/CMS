"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_method_1 = require("../../controller/admin/payment_method");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../middlewares/validation");
const payment_method_2 = require("../../validation/admin/payment_method");
const Multer_1 = require("../../utils/Multer");
const router = (0, express_1.Router)();
// إنشاء طريقة دفع جديدة مع رفع اللوجو والتحقق من صحة البيانات
router.post('/', (0, validation_1.validate)(payment_method_2.CreatePaymentMethodSchema), Multer_1.uploadLogo.single("logo"), (0, catchAsync_1.catchAsync)(payment_method_1.createPaymentMethod));
// الحصول على جميع طرق الدفع
router.get('/', (0, catchAsync_1.catchAsync)(payment_method_1.getAllPaymentMethods));
// الحصول على طريقة دفع واحدة بواسطة الـ ID
router.get('/:id', (0, catchAsync_1.catchAsync)(payment_method_1.getPaymentMethodById));
// تحديث طريقة الدفع مع رفع لوجو جديد إذا تم إرساله والتحقق من صحة البيانات
router.put('/:id', (0, validation_1.validate)(payment_method_2.UpdatePaymentMethodSchema), Multer_1.uploadLogo.single("logo"), (0, catchAsync_1.catchAsync)(payment_method_1.updatePaymentMethod));
// حذف طريقة دفع
router.delete('/:id', (0, catchAsync_1.catchAsync)(payment_method_1.deletePaymentMethod));
exports.default = router;
