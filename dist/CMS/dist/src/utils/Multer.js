"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadWebsite = exports.uploadTemplate = void 0;
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// 📌 تخزين ملفات الـ Templates (zip + photo)
const templateStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, "../uploads/templates");
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // نخلي الاسم unique وفيه اسم الـ field
        const uniqueName = `${file.fieldname}-${Date.now()}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});
exports.uploadTemplate = (0, multer_1.default)({ storage: templateStorage });
// 📌 تخزين ملفات الـ Websites
const websiteStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, "../uploads/websites");
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${file.fieldname}-${Date.now()}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});
exports.uploadWebsite = (0, multer_1.default)({ storage: websiteStorage });
