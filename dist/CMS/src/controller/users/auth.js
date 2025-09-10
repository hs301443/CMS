"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyResetCode = exports.sendResetCode = exports.login = exports.verifyEmail = exports.signup = void 0;
const emailVerifications_1 = require("../../models/shema/auth/emailVerifications");
const User_1 = require("../../models/shema/auth/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const response_1 = require("../../utils/response");
const crypto_1 = require("crypto");
const Errors_1 = require("../../Errors");
const auth_1 = require("../../utils/auth");
const sendEmails_1 = require("../../utils/sendEmails");
const BadRequest_1 = require("../../Errors/BadRequest");
const signup = async (req, res) => {
    const data = req.body;
    // check if user already exists
    const existingUser = await User_1.UserModel.findOne({
        $or: [{ email: data.email }, { phonenumber: data.phoneNumber }],
    });
    if (existingUser) {
        if (existingUser.email === data.email) {
            if (!existingUser.isVerified) {
                // delete old codes
                await emailVerifications_1.EmailVerificationModel.deleteMany({ userId: existingUser._id });
                const code = (0, crypto_1.randomInt)(100000, 999999).toString();
                await emailVerifications_1.EmailVerificationModel.create({
                    userId: existingUser._id,
                    verificationCode: code,
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // صلاحية 15 دقيقة
                });
                await (0, sendEmails_1.sendEmail)(data.email, "Email Verification", `Your verification code is ${code}`);
                return (0, response_1.SuccessResponse)(res, {
                    message: "Verification code resent successfully",
                    userId: existingUser._id,
                }, 200);
            }
            else {
                throw new Errors_1.ConflictError("Email is already registered and verified");
            }
        }
        if (existingUser.phonenumber === data.phoneNumber) {
            throw new Errors_1.ConflictError("Phone Number is already used");
        }
    }
    // hash password
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    // create new user
    const newUser = await User_1.UserModel.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phonenumber: data.phoneNumber,
        imagePath: data.imagePath || null,
        isVerified: false,
    });
    // create verification code
    const code = (0, crypto_1.randomInt)(100000, 999999).toString();
    await emailVerifications_1.EmailVerificationModel.create({
        userId: newUser._id,
        verificationCode: code,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });
    await (0, sendEmails_1.sendEmail)(data.email, "Email Verification", `Your verification code is ${code}`);
    (0, response_1.SuccessResponse)(res, {
        message: "User Signup Successfully. Please verify your email.",
        userId: newUser._id,
    }, 201);
};
exports.signup = signup;
const verifyEmail = async (req, res) => {
    const { userId, code } = req.body;
    if (!userId || !code) {
        return res.status(400).json({ success: false, error: { code: 400, message: "userId and code are required" } });
    }
    const record = await emailVerifications_1.EmailVerificationModel.findOne({ userId });
    if (!record) {
        return res.status(400).json({ success: false, error: { code: 400, message: "No verification record found" } });
    }
    if (record.verificationCode !== code) {
        return res.status(400).json({ success: false, error: { code: 400, message: "Invalid verification code" } });
    }
    if (record.expiresAt < new Date()) {
        return res.status(400).json({ success: false, error: { code: 400, message: "Verification code expired" } });
    }
    // تحديث المستخدم مباشرة بدون save()
    const user = await User_1.UserModel.findByIdAndUpdate(userId, { isVerified: true }, { new: true } // يرجع النسخة المحدثة
    );
    // حذف سجل التحقق
    await emailVerifications_1.EmailVerificationModel.deleteOne({ userId });
    res.json({ success: true, message: "Email verified successfully" });
};
exports.verifyEmail = verifyEmail;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!password) {
        throw new Errors_1.UnauthorizedError("Password is required");
    }
    const user = await User_1.UserModel.findOne({ email });
    if (!user || !user.password) {
        throw new Errors_1.UnauthorizedError("Invalid email or password");
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Errors_1.UnauthorizedError("Invalid email or password");
    }
    if (!user.isVerified) {
        throw new Errors_1.ForbiddenError("Verify your email first");
    }
    const token = (0, auth_1.generateToken)({
        id: user._id,
        name: user.name,
    });
    (0, response_1.SuccessResponse)(res, { message: "Login Successful", token }, 200);
};
exports.login = login;
const sendResetCode = async (req, res) => {
    const { email } = req.body;
    const user = await User_1.UserModel.findOne({ email });
    if (!user)
        throw new Errors_1.NotFound("User not found");
    if (!user.isVerified)
        throw new BadRequest_1.BadRequest("User is not verified");
    const code = (0, crypto_1.randomInt)(100000, 999999).toString();
    // حذف أي كود موجود مسبقًا
    await emailVerifications_1.EmailVerificationModel.deleteMany({ userId: user._id });
    // إنشاء كود جديد
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // ساعتين
    await emailVerifications_1.EmailVerificationModel.create({
        userId: user._id,
        verificationCode: code,
        expiresAt,
    });
    await (0, sendEmails_1.sendEmail)(email, "Reset Password Code", `Hello ${user.name},

Your password reset code is: ${code}
(This code is valid for 2 hours)

Best regards,
Smart College Team`);
    (0, response_1.SuccessResponse)(res, { message: "Reset code sent to your email" }, 200);
};
exports.sendResetCode = sendResetCode;
const verifyResetCode = async (req, res) => {
    const { email, code } = req.body;
    // ✅ 1. دور على اليوزر
    const user = await User_1.UserModel.findOne({ email });
    if (!user)
        throw new Errors_1.NotFound("User not found");
    const userId = user._id;
    // ✅ 2. دور على الكود باستخدام user._id
    const record = await emailVerifications_1.EmailVerificationModel.findOne({ userId });
    if (!record)
        throw new BadRequest_1.BadRequest("No reset code found");
    // ✅ 3. تحقق من الكود
    if (record.verificationCode !== code)
        throw new BadRequest_1.BadRequest("Invalid code");
    // ✅ 4. تحقق من الصلاحية
    if (record.expiresAt < new Date())
        throw new BadRequest_1.BadRequest("Code expired");
    // ✅ 5. رجّع رد النجاح
    (0, response_1.SuccessResponse)(res, { message: "Reset code verified successfully" }, 200);
};
exports.verifyResetCode = verifyResetCode;
const resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;
    const user = await User_1.UserModel.findOne({ email });
    if (!user)
        throw new Errors_1.NotFound("User not found");
    const record = await emailVerifications_1.EmailVerificationModel.findOne({ userId: user._id });
    if (!record)
        throw new BadRequest_1.BadRequest("No reset code found");
    if (record.verificationCode !== code)
        throw new BadRequest_1.BadRequest("Invalid code");
    if (record.expiresAt < new Date())
        throw new BadRequest_1.BadRequest("Code expired");
    user.password = await bcrypt_1.default.hash(newPassword, 10);
    await user.save();
    await emailVerifications_1.EmailVerificationModel.deleteOne({ userId: user._id });
    (0, response_1.SuccessResponse)(res, { message: "Password reset successful" }, 200);
};
exports.resetPassword = resetPassword;
