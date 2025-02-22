const asyncHandler = require("express-async-handler");
const sharp = require("sharp"); // for image processing
const { v4: uuidv4 } = require("uuid");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const CategoryM = require("../models/categoryModel");
const cloudinary = require("../middleware/uploadImagewithCloudinary");
// const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

// @desc   Get all categories
// @route  GET /api/v1/categories
// @access Public
exports.getCategories = factory.getAll(CategoryM, "Category");

// @desc   Get a specific category
// @route  GET /api/v1/categories/:id
// @access Public
exports.getCategory = factory.getOne(CategoryM);

// @desc   Create a new category
// @route  POST /api/v1/categories
// @access Private
exports.createCategory = factory.createOne(CategoryM);

// @desc   Update a category
// @route  PUT /api/v1/categories/:id
// @access Private
exports.updateCategory = factory.updateOne(CategoryM);

// @desc   Delete a category
// @route  DELETE /api/v1/categories/:id
// @access Private
exports.deleteCategory = factory.deleteOne(CategoryM);

//upload category image
// exports.uploadCategoryImage = uploadSingleImage("image"); // for local storage

// //image processing for local storage
// exports.imageProcessing = asyncHandler(async (req, res, next) => {
//   const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
//   if (req.file) {
//     await sharp(req.file.buffer)
//       .resize(600, 600)
//       .toFormat("jpeg")
//       .jpeg({ quality: 90 })
//       .toFile(`uploads/categories/${fileName}`);
//     // Save the image name to the request body
//     req.body.image = fileName;
//   }
//   next();
// });

//image processing
exports.imageProcessing = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    const buffer = await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer();
    const uploadResponse = await cloudinary.uploader.upload_stream(
      {
        folder: "categories",
        public_id: fileName,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return next(new ApiError("Image upload failed", 500));
        }
        req.body.image = result.secure_url;
        next();
      }
    );
    uploadResponse.end(buffer);
  }
  next();
});
