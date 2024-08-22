// multerConfig.js
import multer from 'multer';

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, Date.now()+file.originalname);
  }
});

const upload = multer({ storage });

export default upload