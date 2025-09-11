"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.deleteUser = exports.updateUser = exports.getUserById = exports.createUser = void 0;
const User_1 = require("../../models/shema/auth/User");
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const unauthorizedError_1 = require("../../Errors/unauthorizedError");
const response_1 = require("../../utils/response");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = async (req, res) => {
    if (!req.user || req.user.role !== 'admin')
        throw new unauthorizedError_1.UnauthorizedError("Access denied");
    const { name, email, password, phonenumber } = req.body;
    if (!password) {
        throw new BadRequest_1.BadRequest('Password is required');
    }
    // 🟢 تشفير الباسورد
    const salt = await bcrypt_1.default.genSalt(10);
    const hashedPassword = await bcrypt_1.default.hash(password, salt);
    const user = new User_1.UserModel({
        name,
        email,
        password: hashedPassword,
        phonenumber,
    });
    await user.save();
    (0, response_1.SuccessResponse)(res, { message: 'User created successfully', user: {
            id: user._id,
            name: user.name,
            email: user.email,
        }, });
};
exports.createUser = createUser;
const getUserById = async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        throw new unauthorizedError_1.UnauthorizedError('Access denied');
    }
    const { id } = req.params;
    const user = await User_1.UserModel.findById(id).select('-password');
    if (!user) {
        throw new NotFound_1.NotFound('User not found');
    }
    (0, response_1.SuccessResponse)(res, { message: 'User details', user });
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        throw new unauthorizedError_1.UnauthorizedError('Access denied');
    }
    const { id } = req.params;
    const { name, email, password, phonenumber } = req.body;
    const user = await User_1.UserModel.findById(id);
    if (!user) {
        throw new NotFound_1.NotFound('User not found');
    }
    if (password) {
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        user.password = hashedPassword;
    }
    user.name = name;
    user.email = email;
    user.phonenumber = phonenumber;
    await user.save();
    (0, response_1.SuccessResponse)(res, { message: 'User updated successfully' });
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        throw new unauthorizedError_1.UnauthorizedError('Access denied');
    }
    const { id } = req.params;
    const user = await User_1.UserModel.findByIdAndDelete(id);
    if (!user) {
        throw new NotFound_1.NotFound('User not found');
    }
    (0, response_1.SuccessResponse)(res, { message: 'User deleted successfully' });
};
exports.deleteUser = deleteUser;
const getAllUsers = async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        throw new unauthorizedError_1.UnauthorizedError('Access denied');
    }
    const users = await User_1.UserModel.find().select('-password');
    (0, response_1.SuccessResponse)(res, { message: 'Users fetched successfully', users });
};
exports.getAllUsers = getAllUsers;
