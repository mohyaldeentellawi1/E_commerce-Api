const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("../middleware/uploadImagewithCloudinary");
const BrandModel = require("../models/brandsModel");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

// @desc   Get all Brands
// @route  GET /api/v1/brands
// @access Public
exports.getBrands = factory.getAll(BrandModel, "Brand");

// @desc   Get a specific Brand
// @route  GET /api/v1/brands/:id
// @access Public
exports.getBrand = factory.getOne(BrandModel);

// @desc   Create a new Brand
// @route  POST /api/v1/brands
// @access Private
exports.createBrand = factory.createOne(BrandModel);
// @desc   Update a Brand
// @route  PUT /api/v1/brands/:id
// @access Private
exports.updateBrand = factory.updateOne(BrandModel);

// @desc   Delete a Brand
// @route  DELETE /api/v1/brands/:id
// @access Private
exports.deleteBrand = factory.deleteOne(BrandModel);

//upload brand image
exports.uploadBrandImage = uploadSingleImage("image");

//image processing for local storage
// exports.imageProcessing = asyncHandler(async (req, res, next) => {
//   if (req.file) {
//     const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
//     await sharp(req.file.buffer)
//       .resize(600, 600)
//       .toFormat("jpeg")
//       .jpeg({ quality: 90 })
//       .toFile(`uploads/brands/${fileName}`);
//     // Save the image name to the request body
//     req.body.image = fileName;
//   }
//   next();
// });

//image processing for cloudinary
exports.imageProcessing = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}`;
  if (req.file) {
    const buffer = await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 100 })
      .toBuffer();
    await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "brands",
          public_id: fileName,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            return reject(new ApiError("Image upload failed", 500));
          }
          req.body.image = result.secure_url;
          resolve();
        }
      );
      uploadStream.end(buffer);
    });
  }
  next();
});
