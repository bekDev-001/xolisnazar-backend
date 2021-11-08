const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 100 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    if (
      extname !== ".jpg" &&
      extname !== ".jpeg" &&
      extname !== ".png" &&
      extname !== ".pdf"
    ) {
      const err = new Error("Rasm formati to'g'ri kelmadi");
      err.code = 404;
      return cb(err);
    }
    cb(null, true);
  },
  preservePath: true,
});

module.exports = upload;