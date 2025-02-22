const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const ProductModel = require("../models/productModel");
const { uploadMultipleImages } = require("../middleware/uploadImageMiddleware");
const cloudinary = require("../middleware/uploadImagewithCloudinary");
const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");

exports.uploadProductImages = uploadMultipleImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

// @desc   Image processing for image cover and images for product with cloudinary
exports.productImageProcessing = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover`;
    const imageCoverBuffer = await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 100 })
      .toBuffer();
    await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
          public_id: imageCoverFileName,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            return reject(new ApiError("Image upload failed", 500));
          }
          req.body.imageCover = result.secure_url;
          resolve();
        }
      );
      uploadStream.end(imageCoverBuffer);
    });
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (image, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}`;

        const imageBuffer = await sharp(image.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 100 })
          .toBuffer();

        await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "products",
              public_id: imageName,
              resource_type: "image",
            },
            (error, result) => {
              if (error) {
                return reject(new ApiError("Image upload failed", 500));
              }
              req.body.images.push(result.secure_url);
              resolve();
            }
          );
          uploadStream.end(imageBuffer);
        });
      })
    );
  }
  next();
});

// @desc   Image processing for image cover and images for product
// exports.productImageProcessing = asyncHandler(async (req, res, next) => {
//   if (req.files.imageCover) {
//     const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
//     await sharp(req.files.imageCover[0].buffer)
//       .resize(2000, 1333)
//       .toFormat("jpeg")
//       .jpeg({ quality: 100 })
//       .toFile(`uploads/products/${imageCoverFileName}`);
//     // Save the image cover name in Database
//     req.body.imageCover = imageCoverFileName;
//   }
//   if (req.files.images) {
//     req.body.images = [];
//     await Promise.all(
//       req.files.images.map(async (image, index) => {
//         const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
//         await sharp(image.buffer)
//           .resize(2000, 1333)
//           .toFormat("jpeg")
//           .jpeg({ quality: 95 })
//           .toFile(`uploads/products/${imageName}`);
//         // Save the images name in Database
//         req.body.images.push(imageName);
//       })
//     );
//   }
//   next();
// });

// @desc   Get all products
// @route  GET /api/v1/products
// @access Public
exports.getProducts = factory.getAll(ProductModel, "Product");

// @desc   Get a specific product
// @route  GET /api/v1/products/:id
// @access Public
exports.getProduct = factory.getOne(ProductModel, "reviews");
// @desc   Create a new product
// @route  POST /api/v1/products
// @access Private
exports.createProduct = factory.createOne(ProductModel);

// @desc   Update a product
// @route  PUT /api/v1/products/:id
// @access Private
exports.updateProduct = factory.updateOne(ProductModel);

// @desc   Delete a product
// @route  DELETE /api/v1/products/:id
// @access Private
exports.deleteProduct = factory.deleteOne(ProductModel);
