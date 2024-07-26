const { check  } = require('express-validator'); 
const ProductModel = require('../../models/productModel');
const CategoryModel = require('../../models/categoryModel');
const SubCategoryModel = require('../../models/subCategoryModel');
const ApiError = require('../../utils/apiError');
const slugify = require('slugify');
const validatorMiddleware = require('../../middleware/validatorMiddleware');

exports.createProductValidator = [
    check('title').notEmpty().withMessage('Product Title is required')
    .isLength({ min: 3 }).withMessage('Product Title should be at least 3 characters')
    .isString().withMessage('Product Title should be a string')
    .custom((title)=> ProductModel.findOne({title}).then((title)=>{
        if(title){
        return Promise.reject(
            new ApiError('Title already exists', 400)
        );
        }
        return true;
    }))
    .custom((val , {req})=>{
        req.body.slug = slugify(val);
        return true;
    }),
    check('description').notEmpty().withMessage('Product Description is required')
    .isLength({ max: 2000 }).withMessage('Product Description should be at most 2000 characters'),
    check('quantity').notEmpty().withMessage('Product Quantity is required')
    .isNumeric().withMessage('Product Quantity should be a number'),
    check('sold').optional().isNumeric().withMessage('Product Sold should be a number'),
    check('price').notEmpty().withMessage('Product Price is required')
    .isNumeric().withMessage('Product Price should be a number')
    .isLength({ max: 15 }).withMessage('Product Price should be at most 15 characters'),
    check('priceAfterDiscount').optional().
    isNumeric().withMessage('Product Price After Discount should be a number')
    .toFloat()
    .custom((value, {req}) => {
        if(req.body.price <= value){
        return Promise.reject(new ApiError('Price After Discount must be less than Price', 400));
        }
        return true;
    }),
    check('colors').optional().isArray().withMessage('Product Colors should be an array'),
    check('imageCover').notEmpty().withMessage('Product Image is required'),
    check('images').optional().isArray().withMessage('Product Images should be an array'),
    check('category').notEmpty().withMessage('Product Category is required')
    .isMongoId().withMessage('Invalid Id Format')
    .custom((categoryId)=> CategoryModel.findById(categoryId).then((category)=>{
        if(!category){
        return Promise.reject(
            new ApiError('Category not found', 404)
        );
        }
        return true;
    }))
    ,
    check('subcategories').optional().isMongoId().withMessage('Invalid Id Format')
    .custom((subCategoriesIds) =>
    SubCategoryModel.find({_id:{ $exists : true, $in: subCategoriesIds}}).then((result)=>{
        if(result.length < 1 || result.length !== subCategoriesIds.length){
            return Promise.reject(new ApiError('Subcategories not found', 404));
        }
        return true;
    }))
    .custom((value,{req})=>
    SubCategoryModel.find({category : req.body.category}).then((subCategory)=>{
        const subCategoryIdsInDB = [];
        subCategory.forEach((subCategory) =>{
            subCategoryIdsInDB.push(subCategory._id.toString());
        })
        if(!value.every((v)=>subCategoryIdsInDB.includes(v))){
            return Promise.reject(new ApiError('Subcategories not found in this category', 404));
        }
    })),
    check('brand').optional().isMongoId().withMessage('Invalid Id Format'),
    check('ratingsAverage').optional()
    .isNumeric().withMessage('Product Ratings Average should be a number')
    .isLength({ min: 1 }).withMessage('Product Ratings Average should be at least 1')
    .isLength({ max: 5 }).withMessage('Product Ratings Average should be at most 5'),
    check('ratingsQuantity').optional().isNumeric().withMessage('Product Ratings Quantity should be a number'),
    validatorMiddleware
    ];

exports.getProdcutValidator = [
    check('id').isMongoId().withMessage('Invalid Id Format')
    .notEmpty().withMessage('Product Id is required'),
    validatorMiddleware
];

exports.updateProductValidator = [
    check('id').isMongoId().withMessage('Invalid Id Format'),
    check('title').optional()
    .isLength({ min: 3 }).withMessage('Product Title should be at least 3 characters')
    .isString().withMessage('Product Title should be a string')
    .custom((title)=> ProductModel.findOne({title}).then((title)=>{
        if(title){
        throw new ApiError('Title already exists', 400);
        }
        return true;
    })).custom((val , {req})=>{
        req.body.slug = slugify(val);
        return true;
    }),
    check('description').optional()
    .isLength({ max: 2000 }).withMessage('Product Description should be at most 2000 characters'),
    check('quantity').optional()
    .isNumeric().withMessage('Product Quantity should be a number'),
    check('sold').optional().isNumeric().withMessage('Product Sold should be a number'),
    check('price').optional()
    .isNumeric().withMessage('Product Price should be a number')
    .isLength({ max: 15 }).withMessage('Product Price should be at most 15 characters'),
    check('priceAfterDiscount').optional().
    isNumeric().withMessage('Product Price After Discount should be a number')
    .toFloat()
    .custom((value, {req}) => {
        if(req.body.price <= value){
        return Promise.reject(new ApiError('Price After Discount must be less than Price', 400));
        }
        return true;
    }),
    check('colors').optional().isArray().withMessage('Product Colors should be an array'),
    check('imageCover').optional(),
    check('images').optional().isArray().withMessage('Product Images should be an array'),
    check('category').optional()
    .isMongoId().withMessage('Invalid Id Format'),
    check('subcategories').optional().isMongoId().withMessage('Invalid Id Format')
    .custom((subCategoriesIds) =>
    SubCategoryModel.find({_id:{ $exists : true, $in: subCategoriesIds}}).then((result)=> {
        if(result.length < 1 || result.length !== subCategoriesIds.length){
            return Promise.reject(new ApiError('Subcategories not found', 404));
        }
        return true;
    }))
    .custom((value,{req})=>
    SubCategoryModel.find({category : req.body.category}).then((subCategory)=>{
        const subCategoryIdsInDB = [];
        subCategory.forEach((subCategory) => {
            subCategoryIdsInDB.push(subCategory._id.toString());
        })
        if(!value.every((v)=>subCategoryIdsInDB.includes(v))){
            return Promise.reject(new ApiError('Subcategories not found in this category', 404));
        }
    })),
    check('brand').optional().isMongoId().withMessage('Invalid Id Format'),
    check('ratingsAverage').optional()
    .isNumeric().withMessage('Product Ratings Average should be a number')
    .isLength({ min: 1 }).withMessage('Product Ratings Average should be at least 1')
    .isLength({ max: 5 }).withMessage('Product Ratings Average should be at most 5'),
    check('ratingsQuantity').optional().isNumeric().withMessage('Product Ratings Quantity should be a number'),
    validatorMiddleware
];

exports.deleteProductValidator = [
    check('id').isMongoId().withMessage('Invalid Id Format')
    .notEmpty().withMessage('Product Id is required'),
    validatorMiddleware
];