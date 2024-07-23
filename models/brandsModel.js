const mongoose = require('mongoose');



// Create a Brand Schema
const BrandSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Brand name is required'],
        trim: true,
        unique:[true, 'Brand name must be unique'],
        maxlength: [50, 'Brand name must not exceed 50 characters'],
        minlenght: [4, 'Brand name must be at least 3 characters']
    },
    slug: {
        type: String,
        // lowercase: true,
    },
    image: String,
}, 
{timestamps: true},
);



// Create a Model
const BrandModel = mongoose.model('Brand', BrandSchema);

module.exports = BrandModel;