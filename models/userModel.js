const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: [true, 'Name is required'],
    },
    slug:{
        type: String,
    },
    email:{
        type: String,
        lowercase: true,    
        trim: true,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique'],
    },
    password:{
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minlength: [6, 'Too short password'],
    },
    phone: {
        type: String,
        trim: true,
    },
    profileImage : {
        type: String,
    },
    role : {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    active: {
        type: Boolean,
        default: true,
    },
},
{timestamps: true},
);


const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;