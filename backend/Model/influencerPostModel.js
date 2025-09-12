let mongoose = require('mongoose');
let User = require('./userModel');
const announcementSchema = new mongoose.Schema({
    // Basic Post Information
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
   
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    
    // Media Content
    Bannerimage: {
        type: String,
        required: [true, 'Image is required'],
    },
    profileImage: {
        type: String,
        ref: 'user',
    },
    
    // Post Metadata
    isEdited: {
        type: Boolean,
        default: false,
    },
    editedAt: {
        type: Date,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
    },
    

    // User Reference
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'User is required'],
    },
    
    // Engagement
    likes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        like:{
            type: Boolean,
            default: true,
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
        dislike:{
            type: Boolean,
            default: true,
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
    
    // Status
    isActive: {
        type: Boolean,
        default: true,
    },
    
}, { timestamps: true });

// Pre-save middleware to set editedAt when isEdited is true
announcementSchema.pre('save', function(next) {
    if (this.isEdited && !this.editedAt) {
        this.editedAt = new Date();
    }
    next();
});

const influencerPostModel = mongoose.model('influencerPostModel', announcementSchema);

module.exports = influencerPostModel;