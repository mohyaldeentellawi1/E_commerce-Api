const { check } = require("express-validator");
const slugify = require("slugify");
const ApiError = require("../apiError");
const ProductM = require("../../models/productModel");
const CategoryM = require("../../models/categoryModel");
const SubCategoryM = require("../../models/subCategoryModel");
const BrandM = require("../../models/brandsModel");

const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product Title is required")
    .isLength({ min: 3 })
    .withMessage("Product Title should be at least 3 characters")
    .isString()
    .withMessage("Product Title should be a string")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product Description is required")
    .isLength({ min: 20 })
    .withMessage("Product Description should be at least 20 characters"),
  check("quantity")
    .notEmpty()
    .withMessage("Product Quantity is required")
    .isNumeric()
    .withMessage("Product Quantity should be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product Sold should be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product Price is required")
    .isNumeric()
    .withMessage("Product Price should be a number")
    .toFloat(),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product Price After Discount should be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        return Promise.reject(
          new ApiError("Price After Discount must be less than Price", 400)
        );
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Product Colors should be an array"),
  check("imageCover").notEmpty().withMessage("Product Image is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product Images should be an array"),
  check("category")
    .notEmpty()
    .withMessage("Product Category is required")
    .isMongoId()
    .withMessage("Invalid Id Format")
    .custom(async (categoryID) => {
      const category = await CategoryM.findById(categoryID);
      if (!category) {
        return Promise.reject(new ApiError("Category not found", 400));
      }
      return true;
    }),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid Id Format")
    .isArray()
    .withMessage("Product Subcategories should be an array")
    .custom((subcategoriesIDs) =>
      SubCategoryM.find({
        _id: { $exists: true, $in: subcategoriesIDs },
      }).then((result) => {
        if (result.length < 1 || result.length !== subcategoriesIDs.length) {
          return Promise.reject(new ApiError("SubCategory not found", 404));
        }
        return true;
      })
    )
    .custom(async (val, { req }) => {
      const subCategories = await SubCategoryM.find({
        category: req.body.category,
      });
      const subCategoriesInDB = [];
      subCategories.forEach((subCategory) => {
        subCategoriesInDB.push(subCategory._id.toString());
      });
      const checker = val.every((v) => subCategoriesInDB.includes(v));
      if (!checker) {
        return Promise.reject(
          new ApiError("SubCategory not found in this category", 404)
        );
      }
      return true;
    }),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid Id Format")
    .custom(async (brandID) => {
      const brand = await BrandM.findById(brandID);
      if (!brand) {
        return Promise.reject(new ApiError("Brand not found", 404));
      }
      return true;
    }),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Product Ratings Average should be a number")
    .isLength({ min: 1 })
    .withMessage("Product Ratings Average should be at least 1")
    .isLength({ max: 5 })
    .withMessage("Product Ratings Average should be at most 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product Ratings Quantity should be a number"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Product Title should be at least 3 characters")
    .isString()
    .withMessage("Product Title should be a string")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .optional()
    .isLength({ min: 20 })
    .withMessage("Product Description should be at least 20 characters"),
  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Product Quantity should be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product Sold should be a number"),
  check("price")
    .optional()
    .isNumeric()
    .withMessage("Product Price should be a number")
    .toFloat(),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product Price After Discount should be a number")
    .toFloat()
    .custom(async (value, { req }) => {
      let { price } = req.body;
      if (!price) {
        const product = await ProductM.findById(req.params.id).select("price");
        if (!product) {
          return Promise.reject(new ApiError("Product not found", 404));
        }
        ({ price } = product);
      }
      if (price <= value) {
        return Promise.reject(
          new ApiError("Price After Discount must be less than Price", 400)
        );
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Product Colors should be an array"),
  check("imageCover").optional(),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product Images should be an array"),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid Id Format")
    .custom(async (categoryID) => {
      const category = await CategoryM.findById(categoryID);
      if (!category) {
        return Promise.reject(new ApiError("Category not found", 404));
      }
      return true;
    }),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid Id Format")
    .custom((subcategoriesIDs) =>
      SubCategoryM.find({
        _id: { $exists: true, $in: subcategoriesIDs },
      }).then((result) => {
        if (result.length < 1 || result.length !== subcategoriesIDs.length) {
          return Promise.reject(new ApiError("SubCategory not found", 404));
        }
        return true;
      })
    )
    .custom(async (val, { req }) => {
      if (!req.body.category) {
        return Promise.reject(new ApiError("Category is required", 400));
      }
      SubCategoryM.find({ category: req.body.category }).then(
        (subCategories) => {
          const subCategoriesInDB = [];
          subCategories.forEach((subCategory) => {
            subCategoriesInDB.push(subCategory._id.toString());
          });
          const checker = val.every((v) => subCategoriesInDB.includes(v));
          if (!checker) {
            return Promise.reject(
              new ApiError("SubCategory not found in this category", 404)
            );
          }
          return true;
        }
      );
      const subCategories = await SubCategoryM.find({
        category: req.body.category,
      });
      const subCategoriesInDB = [];
      subCategories.forEach((subCategory) => {
        subCategoriesInDB.push(subCategory._id.toString());
      });
      const checker = val.every((v) => subCategoriesInDB.includes(v));
      if (!checker) {
        return Promise.reject(
          new ApiError("SubCategory not found in this category", 404)
        );
      }
    }),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid Id Format")
    .custom(async (brandID) => {
      const brand = await BrandM.findById(brandID);
      if (!brand) {
        return Promise.reject(new ApiError("Brand not found", 404));
      }
      return true;
    }),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Product Ratings Average should be a number")
    .isLength({ min: 1 })
    .withMessage("Product Ratings Average should be at least 1")
    .isLength({ max: 5 })
    .withMessage("Product Ratings Average should be at most 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product Ratings Quantity should be a number"),
  validatorMiddleware,
];

exports.getProdcutValidator = [
  check("id").isMongoId().withMessage("Invalid Product Id"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product Id"),
  validatorMiddleware,
];
