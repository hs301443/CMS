import fs from "fs";
import multer from "multer";
import path from "path";

// 📌 تخزين ملفات الـ Templates (zip + photo)
const templateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/templates");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// ✅ هنا خلينا نستخدم fields بدل single
export const uploadTemplate = multer({ storage: templateStorage });


// 📌 تخزين ملفات الـ Websites (زي ما هي)
const websiteStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/websites");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const uploadWebsite = multer({ storage: websiteStorage });
