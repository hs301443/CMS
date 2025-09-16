"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePaymentMethod = exports.updatePaymentMethod = exports.getPaymentMethodById = exports.getAllPaymentMethods = exports.createPaymentMethod = void 0;
const payment_methods_1 = require("../../models/shema/payment_methods");
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const unauthorizedError_1 = require("../../Errors/unauthorizedError");
const response_1 = require("../../utils/response");
const createPaymentMethod = async (req, res) => {
    // التحقق من صلاحيات الأدمن
    if (!req.user || req.user.role !== "admin") {
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    }
    const { name, discription } = req.body;
    if (!name || !discription) {
        throw new BadRequest_1.BadRequest("Please provide all the required fields");
    }
    // التأكد من رفع اللوجو
    if (!req.file) {
        throw new BadRequest_1.BadRequest("Logo file is required");
    }
    // بناء اللينك الكامل للملف بعد رفعه
    const logo_Url = `${req.protocol}://${req.get("host")}/uploads/payment_logos/${req.file.filename}`;
    const paymentMethod = await payment_methods_1.PaymentMethodModel.create({
        name,
        discription,
        logo_Url,
        isActive: true,
    });
    (0, response_1.SuccessResponse)(res, {
        message: "Payment method created successfully",
        paymentMethod,
    });
};
exports.createPaymentMethod = createPaymentMethod;
const getAllPaymentMethods = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const paymentMethods = await payment_methods_1.PaymentMethodModel.find();
    if (!paymentMethods)
        throw new NotFound_1.NotFound('No payment methods found');
    (0, response_1.SuccessResponse)(res, { message: 'All payment methods fetched successfully', paymentMethods });
};
exports.getAllPaymentMethods = getAllPaymentMethods;
const getPaymentMethodById = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest('Please provide payment method id');
    const paymentMethod = await payment_methods_1.PaymentMethodModel.findById(id);
    if (!paymentMethod)
        throw new NotFound_1.NotFound('Payment method not found');
    (0, response_1.SuccessResponse)(res, { message: 'Payment method fetched successfully', paymentMethod });
};
exports.getPaymentMethodById = getPaymentMethodById;
const updatePaymentMethod = async (req, res) => {
    // التحقق من صلاحيات الأدمن
    if (!req.user || req.user.role !== "admin")
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest("Please provide payment method id");
    const paymentMethod = await payment_methods_1.PaymentMethodModel.findById(id);
    if (!paymentMethod)
        throw new NotFound_1.NotFound("Payment method not found");
    // تحديث الحقول من body
    Object.assign(paymentMethod, req.body);
    // تحديث اللوجو لو تم رفعه
    if (req.file) {
        paymentMethod.logo_Url = `${req.protocol}://${req.get("host")}/uploads/payment_logos/${req.file.filename}`;
    }
    await paymentMethod.save(); // حفظ التغييرات
    (0, response_1.SuccessResponse)(res, {
        message: "Payment method updated successfully",
        paymentMethod
    });
};
exports.updatePaymentMethod = updatePaymentMethod;
const deletePaymentMethod = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const { id } = req.params;
    if (!id)
        throw new BadRequest_1.BadRequest('Please provide payment method id');
    const paymentMethod = await payment_methods_1.PaymentMethodModel.findByIdAndDelete(id);
    if (!paymentMethod)
        throw new NotFound_1.NotFound('Payment method not found');
    (0, response_1.SuccessResponse)(res, { message: 'Payment method deleted successfully' });
};
exports.deletePaymentMethod = deletePaymentMethod;
