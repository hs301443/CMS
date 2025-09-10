"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const Admin_1 = require("../../models/shema/auth/Admin");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Errors_1 = require("../../Errors");
const response_1 = require("../../utils/response");
const auth_1 = require("../../utils/auth");
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new Errors_1.UnauthorizedError("Email and password are required");
    }
    const admin = await Admin_1.AdminModel.findOne({ email });
    if (!admin) {
        throw new Errors_1.UnauthorizedError("Invalid email or password");
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, admin.hashedPassword);
    if (!isPasswordValid) {
        throw new Errors_1.UnauthorizedError("Invalid email or password");
    }
    const token = (0, auth_1.generateToken)({
        id: admin.id,
        name: admin.name,
        role: "admin",
    });
    (0, response_1.SuccessResponse)(res, { message: "login Successful", token: token }, 200);
};
exports.login = login;
