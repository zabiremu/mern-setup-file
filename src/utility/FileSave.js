const multer = require("multer");
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};
const storage = multer.diskStorage({
  destination: function (req, image, cb) {
    cb(null, "src/public/uploads");
  },
  filename: (req, image, callback) => {
    const name = image.originalname.split(" ").join("_");
    const extension = MIME_TYPES[image.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

const upload = multer({ storage: storage });
exports.upload = upload;
