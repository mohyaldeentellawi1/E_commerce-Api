const mongoose = require('mongoose');



// Create a Schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        unique: [true, 'Category name must be unique'],
        maxlength: [50, 'Category name must not exceed 50 characters'],
        minlenght: [4, 'Category name must be at least 3 characters']
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: String,
}, { timestamps: true });


// update , delete, get , getALL
categorySchema.post('init', (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image = imageUrl;
    }
});

// create
categorySchema.post('save', (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image = imageUrl;
    }
});


// Create a Model
const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;