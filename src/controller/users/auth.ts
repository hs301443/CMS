import { Request, Response } from "express";
import { EmailVerificationModel} from "../../models/shema/auth/emailVerifications";
import { UserModel } from "../../models/shema/auth/User";
import bcrypt from "bcrypt";
import { SuccessResponse } from "../../utils/response";
import { randomInt } from "crypto";
import {
  ConflictError,
  ForbiddenError,
  NotFound,
  UnauthorizedError,
} from "../../Errors";
import { generateToken } from "../../utils/auth";
import { sendEmail } from "../../utils/sendEmails";
import { BadRequest } from "../../Errors/BadRequest";


export const signup = async (req: Request, res: Response) => {
  const data = req.body;

  // check if user already exists
  const existingUser = await UserModel.findOne({
    $or: [{ email: data.email }, { phonenumber: data.phoneNumber }],
  });

  if (existingUser) {
    if (existingUser.email === data.email) {
      if (!existingUser.isVerified) {
        // delete old codes
        await EmailVerificationModel.deleteMany({ userId: existingUser._id });

        const code = randomInt(100000, 999999).toString();

        await EmailVerificationModel.create({
          userId: existingUser._id,
          verificationCode: code,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // صلاحية 15 دقيقة
        });

        await sendEmail(
          data.email,
          "Email Verification",
          `Your verification code is ${code}`
        );

        return SuccessResponse(
          res,
          {
            message: "Verification code resent successfully",
            userId: existingUser._id,
          },
          200
        );
      } else {
        throw new ConflictError("Email is already registered and verified");
      }
    }

    if (existingUser.phonenumber === data.phoneNumber) {
      throw new ConflictError("Phone Number is already used");
    }
  }

  // hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // create new user
  const newUser = await UserModel.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    phonenumber: data.phoneNumber,
    isVerified: false,
  });

  // create verification code
  const code = randomInt(100000, 999999).toString();

  await EmailVerificationModel.create({
    userId: newUser._id,
    verificationCode: code,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  await sendEmail(
    data.email,
    "Email Verification",
    `Your verification code is ${code}`
  );

  SuccessResponse(
    res,
    {
      message: "User Signup Successfully. Please verify your email.",
      userId: newUser._id,
    },
    201
  );
};


export const verifyEmail = async (req: Request, res: Response) => {
  const { userId, code } = req.body;

  if (!userId || !code) {
    return res.status(400).json({ success: false, error: { code: 400, message: "userId and code are required" } });
  }

  const record = await EmailVerificationModel.findOne({ userId });
  if (!record) {
    return res.status(400).json({ success: false, error: { code: 400, message: "No verification record found" } });
  }

  if (record.verificationCode !== code) {
    return res.status(400).json({ success: false, error: { code: 400, message: "Invalid verification code" } });
  }

  if (record.expiresAt < new Date()) {
    return res.status(400).json({ success: false, error: { code: 400, message: "Verification code expired" } });
  }

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { isVerified: true },
    { new: true } // يرجع المستند بعد التحديث
  );

  if (!user) {
    return res.status(404).json({ success: false, error: { code: 404, message: "User not found" } });
  }

  // حذف سجل التحقق
  await EmailVerificationModel.deleteOne({ userId });

  // توليد التوكن
  const token = generateToken({
    id: user._id,
    name: user.name,
  });

  // إرسال الرد مع التوكن
  return res.json({ success: true, message: "Email verified successfully", token });
};



export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!password) {
    throw new UnauthorizedError("Password is required");
  }

  const user = await UserModel.findOne({ email });
  if (!user || !user.password) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError("Invalid email or password");
  }

  
  if (!user.isVerified) {
    throw new ForbiddenError("Verify your email first");
  }

  const token = generateToken({
    id: user._id,
    name: user.name,
  });

  SuccessResponse(res, { message: "Login Successful", token }, 200);
};





export const sendResetCode = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) throw new NotFound("User not found");
  if (!user.isVerified) throw new BadRequest("User is not verified");

  const code = randomInt(100000, 999999).toString();

  // حذف أي كود موجود مسبقًا
  await EmailVerificationModel.deleteMany({ userId: user._id });

  // إنشاء كود جديد
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // ساعتين
  await EmailVerificationModel.create({
    userId: user._id,
    verificationCode: code,
    expiresAt,
  });

  await sendEmail(
    email,
    "Reset Password Code",
    `Hello ${user.name},

Your password reset code is: ${code}
(This code is valid for 2 hours)

Best regards,
Smart College Team`
  );

  SuccessResponse(res, { message: "Reset code sent to your email" }, 200);
};

export const verifyResetCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) throw new NotFound("User not found");

  const userId = user._id;
  const record = await EmailVerificationModel.findOne({ userId});
  if (!record) throw new BadRequest("No reset code found");

  if (record.verificationCode !== code) throw new BadRequest("Invalid code");

  if (record.expiresAt < new Date()) throw new BadRequest("Code expired");


  SuccessResponse(res, { message: "Reset code verified successfully" }, 200);
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) throw new NotFound("User not found");

  const record = await EmailVerificationModel.findOne({ userId: user._id });
  if (!record) throw new BadRequest("No reset code found");

  // تحديث الباسورد
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  // حذف سجل التحقق
  await EmailVerificationModel.deleteOne({ userId: user._id });

  // توليد التوكن
  const token = generateToken({
    id: user._id,
    name: user.name,
  });

  // إرسال الرد مع التوكن
  return SuccessResponse(res, { message: "Password reset successful", token }, 200);
};
