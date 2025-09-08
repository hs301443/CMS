import fs from "fs";
import multer from "multer";
import path from "path";

const uploadPath = path.join(__dirname, "../uploads/templates");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

export const upload = multer({ storage });

