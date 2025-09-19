let mongoose = require('mongoose');
let User = require('./userModel');
const profileSchema = new mongoose.Schema({
    // Profile Type - determines which fields are required
    profileType: {
        type: String,
default:'influencer'  
  },
    profileImage: {
        type: String,
        required: [true, 'Profile image is required'],
    },
    
    name: {
        type: String,
        // required: [true, 'Your name is required'],
    },
  
   
    
    locationURL: {
        type: String,
    },
    
    // Category Information
    selectCategory: {
        type: String,
        required: [true, 'Category is required'],
    },
  
    
    // Business/Service Details
    description: {
        type: String,
        required: function() {
            return this.profileType === 'Service Profile';
        },
    },
  
    
    experience: {
        type: String,
        required: function() {
            return this.profileType === 'Service Profile';
        },
    },
    
   
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: {
            validator: function(v) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Please enter a valid email'
        }
    },
    
    // Contact & Communication
    allowCallInApp: {
        type: Boolean,
        default: false,
        required: [true, 'Allow call in app preference is required'],
    },
    allowCallViaPhone: {
        type: Boolean,
        default: false,
        required: [true, 'Allow call via phone preference is required'],
    },
    phoneNumberForCalls: {
        type: String,
        required: function() {
            return this.allowCallViaPhone === true;
        },
    },
    allowChat: {
        type: Boolean,
        default: false,
        required: [true, 'Allow chat preference is required'],
    },
    
 
     
    // User Reference
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'User is required'],
    },

    likes: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
          },
          like: {
            type: Boolean,
            default: true,
          },
        },
      ],
      dislikes: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
          },
          dislike: {
            type: Boolean,
            default: true,
          },
        },
      ],

      comments: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
        },
      ],
    colaboration:[{
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        }
    }],
    followers: [
        {follow:{
            type: Boolean,
            default: true,
        },
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
          },
        },
      ],
      following: [
        {following:{
            type: Boolean,
            default: true,
        },
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
          },
        },
      ],

    membershipPlan: {
    type: [String],
 }
    
}, {timestamps: true});

// Pre-save middleware to handle conditional validation
profileSchema.pre('save', function(next) {
    // Additional validation logic can be added here if needed
    next();
});

const InfluencerRegiestrationModel = mongoose.model('RegistrationModel', profileSchema);

module.exports = InfluencerRegiestrationModel;
