const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    passwordChangedAt : Date,
    phone: {
        type: String,
        trim: true,
    },
    profileImage : {
        type: String,
    },
    role : {
        type: String,
        enum: ['user', 'admin', 'manager'],
        default: 'user',
    },
    active: {
        type: Boolean,
        default: true,
    },
},
{timestamps: true},
);

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// update , delete, get , getALL
UserSchema.post('init', (doc)=>{
    if(doc.profileImage){
        const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImage}`;
        doc.profileImage = imageUrl;
    }
});

// create
UserSchema.post('save', (doc)=>{
    if(doc.profileImage){
        const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImage}`;
        doc.profileImage = imageUrl;
    }
});


const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
