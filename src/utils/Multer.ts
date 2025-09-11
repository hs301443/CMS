import fs from "fs";
import multer from "multer";
import path from "path";

// 📌 دالة عامة لإنشاء storage لفولدر معين
const makeStorage = (folderName: string) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, `../uploads/${folderName}`);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // نخلي الاسم unique + fieldname + extension
      const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });

// 📌 استخدام الدالة للأنواع المختلفة
export const uploadTemplate = multer({ storage: makeStorage("templates") });
export const uploadWebsite  = multer({ storage: makeStorage("websites") });
export const uploadLogo     = multer({ storage: makeStorage("payment_logos") });
