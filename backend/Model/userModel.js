const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // allow multiple null/missing values
        validate: {
            validator: function (v) {
                return !v || validator.isEmail(v); // validate only if provided
            },
            message: 'Email is invalid'
        },
    },
    phone: {
        type: Number,
        unique: true,
        sparse: true,  
      default: undefined, 

    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
    },
    role: {
        type: String,
        enum: ['client', 'influencer','ADMIN'],
        default: 'client'
    },
    verified: {
        type: Boolean,
        default: true
    },
    worked_jobId: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    ratting: [
        {
            userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
    },
        reachNo:{
            type: Number,
            default: 0
        }
}],
reach:[{
    userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
    },
        reachNo:{
            type: Number,
            default: 0
        }
}],
    review:[{
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        reeview:{
            type: String,
        }
     }]

}, { timestamps: true });

/**
 * Custom validation: require at least email or phone
 */
userSchema.pre('validate', function (next) {
    if (!this.email && !this.phone) {
        this.invalidate('email', 'Either email or phone is required');
        this.invalidate('phone', 'Either email or phone is required');
    }
    next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;
