let mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    // Profile Type - determines which fields are required
    profileType: {
        type: String,
        default:'client'
     },
    profileImage: {
        type: String,
        required: [true, 'Profile image is required'],
    },
    
    name: {
        type: String,
        // required: [true, 'Your name is required'],
    },
    businessName: {
        type: String,
        // required: function() {
        //     return this.profileType === 'Business Profile';
        // },
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
  
    establishedInYear: {
        type: String,
        required: function() {
            return this.profileType === 'Business Profile';
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
    
 
    workBusinessImages: {
        type: [String],
        required: function() {
            return this.profileType === 'Business Profile';
        },
        validate: {
            validator: function(v) {
                return this.profileType !== 'Business Profile' || (v && v.length > 0);
            },
            message: 'Work/Business images are required for Business Profile'
        }
    },
    
    // User Reference
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'User is required'],
    },
    
    
    // Status
    isActive: {
        type: Boolean,
        default: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
    ,// Engagement
    likes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        likeDate: {
            type: Date,
            default: Date.now,
        }
    }],
    
    dislikes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        dislikeDate: {
            type: Date,
            default: Date.now,
        }
    }],
    
    shares: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        shareDate: {
            type: Date,
            default: Date.now,
        }
    }],
    
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        commentDate: {
            type: Date,
            default: Date.now,
        }
    }],
    
    colaboration:[{
postId:
{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
}
}],
membershipPlan: {
    type: [String],
 }
    
    
}, {timestamps: true});

// Pre-save middleware to handle conditional validation
profileSchema.pre('save', function(next) {
    // Additional validation logic can be added here if needed
    next();
});

const ClientRegistrationModel = mongoose.model('ClientRegistrationModel', profileSchema);

module.exports = ClientRegistrationModel;
