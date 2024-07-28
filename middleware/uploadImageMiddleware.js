const multer = require('multer');
const ApiError = require('../utils/apiError');


multerOption = () => {
// memory storage engine as buffer
const multerStorage = multer.memoryStorage();
// Multer Filter
const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    } else{
        cb(new ApiError('Not an image! Please upload only images.', 400), false);
    }
};
const upload = multer({ storage: multerStorage ,fileFilter: multerFilter});
return upload;
};

exports.uploadSingleImage = (fieldName) => multerOption().single(fieldName); 

exports.uploadMultipleImages = (arrayOfFields)=>  multerOption().fields(arrayOfFields);



// Disk Storage Engine
// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/categories');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
//         cb(null, fileName);
//     }
// });