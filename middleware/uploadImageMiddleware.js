const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const ApiError = require("../utils/apiError");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  secure: true,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});
const multerOption = () => {
  // memory storage engine as buffer
  const multerStorage = multer.memoryStorage();
  // Multer Filter
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true); // here null means no error
    } else {
      cb(new ApiError("Not an image! Please upload only images.", 400), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOption().single(fieldName);

exports.uploadMultipleImages = (arrayOfFields) =>
  multerOption().fields(arrayOfFields);
