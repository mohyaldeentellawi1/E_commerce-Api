const mongoose = require('mongoose');


// Create a Product Schema
const productSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        maxlength: [100, 'Product title must not exceed 100 characters'],
        minlength: [5, 'Product title must be at least 5 characters']
    },
    slug: {
        type: String,
        // lowercase: true,
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        minlength: [20, 'Product description must be at least 20 characters']
    },
    quantity: {
        type: Number
    },
    sold: {
        type:Number,
        default: 0
    },
    price:{
        type:Number,
        required: [true, 'Product price is required'],
        trim: true,
        max: [200000, 'Product price must not exceed 15 characters'],
    },
    priceAfterDiscount:{
        type:Number,
        trim: true,
        default: 0
    },
    colors:[String],
    imageCovor:{
        type: String,
        required: [true, 'Product image is required'],
    },
    images: [String],
    category:{
        type:mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    subcategories:[{
        type:mongoose.Schema.ObjectId,
        ref: 'SubCategory',
    }],
    brand:{
        type:mongoose.Schema.ObjectId,
        ref: 'Brand'
    },
    ratingsAverage:{
        type:Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must not exceed 5'],
    },
    ratingsQuantity:{
        type:Number,
        default: 0
    },
},
{timestamps: true}
);

productSchema.pre(/^find/, function(next){
    this.populate({
        path: 'category',
        select: 'name -_id'
    });
    next();
});

const ProductModel = mongoose.model('Product', productSchema);


module.exports = ProductModel;