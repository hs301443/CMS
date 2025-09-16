import { Request, Response } from 'express';
import { PaymentMethodModel } from '../../models/shema/payment_methods';
import { BadRequest } from '../../Errors/BadRequest';
import { NotFound } from '../../Errors/NotFound';
import { UnauthorizedError } from '../../Errors/unauthorizedError';
import { SuccessResponse } from '../../utils/response';

export const createPaymentMethod = async (req: Request, res: Response) => {
  // التحقق من صلاحيات الأدمن
  if (!req.user || req.user.role !== "admin") {
    throw new UnauthorizedError("Access denied");
  }

  const { name, discription } = req.body;
  if (!name || !discription) {
    throw new BadRequest("Please provide all the required fields");
  }

  // التأكد من رفع اللوجو
  if (!req.file) {
    throw new BadRequest("Logo file is required");
  }

  // بناء اللينك الكامل للملف بعد رفعه
  const logo_Url = `${req.protocol}://${req.get("host")}/uploads/payment_logos/${req.file.filename}`;

  const paymentMethod = await PaymentMethodModel.create({
    name,
    discription,
    logo_Url,
    isActive: true,
  });

  SuccessResponse(res, {
    message: "Payment method created successfully",
    paymentMethod,
  });
};

export const getAllPaymentMethods = async (req: Request, res: Response) => {
      if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");

        const paymentMethods = await PaymentMethodModel.find();
    if (!paymentMethods) throw new NotFound('No payment methods found');
    SuccessResponse(res, { message: 'All payment methods fetched successfully', paymentMethods });
}

export const getPaymentMethodById = async (req: Request, res: Response) => {
      if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");

        const { id } = req.params;
    if (!id) throw new BadRequest('Please provide payment method id');
    const paymentMethod = await PaymentMethodModel.findById(id);
    if (!paymentMethod) throw new NotFound('Payment method not found');
    SuccessResponse(res, { message: 'Payment method fetched successfully', paymentMethod });
}


export const updatePaymentMethod = async (req: Request, res: Response) => {
  // التحقق من صلاحيات الأدمن
  if (!req.user || req.user.role !== "admin") 
    throw new UnauthorizedError("Access denied");

  const { id } = req.params;
  if (!id) throw new BadRequest("Please provide payment method id");

  const paymentMethod = await PaymentMethodModel.findById(id);
  if (!paymentMethod) throw new NotFound("Payment method not found");

  // تحديث الحقول من body
  Object.assign(paymentMethod, req.body);

  // تحديث اللوجو لو تم رفعه
  if (req.file) {
    paymentMethod.logo_Url = `${req.protocol}://${req.get("host")}/uploads/payment_logos/${req.file.filename}`;
  }

  await paymentMethod.save(); // حفظ التغييرات

  SuccessResponse(res, { 
    message: "Payment method updated successfully", 
    paymentMethod 
  });
};
export const deletePaymentMethod = async (req: Request, res: Response) => {
      if (!req.user || req.user.role !== 'admin')  throw new UnauthorizedError("Access denied");

    const { id } = req.params;
    if (!id) throw new BadRequest('Please provide payment method id');
    const paymentMethod = await PaymentMethodModel.findByIdAndDelete(id);
    if (!paymentMethod) throw new NotFound('Payment method not found');
    SuccessResponse(res, { message: 'Payment method deleted successfully' });
}
