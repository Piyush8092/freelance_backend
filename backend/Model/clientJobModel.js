let mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    // Basic Job Information
    title: {
        type: String,
        required: [true, 'Job title is required'],
    },
    description: {
        type: String,
        required: [true, 'Job description is required'],
    },
    
    // Budget Information
    budgetFrom: {
        type: Number,
        required: [true, 'Budget from is required'],
    },
    budgetTo: {
        type: Number,
        required: [true, 'Budget to is required'],
    },
    currency: {
        type: String,
        default: 'INR',
    },
    
    // Project Duration
    projectDuration: {
        type: String,
        required: [true, 'Project duration is required'],
    },
    
    // Category Information
    selectCategory: {
        type: String,
        required: [true, 'Category is required'],
    },
    selectSubCategory: {
        type: String,
    },
    
    // Contact & Communication (from client model)
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
    
    // User Reference (from client model)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'User is required'],
    },
    
    // Job Statistics
    bids: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        bidAmount: {
            type: Number,
        },
        proposal: {
            type: String,
        },
        bidDate: {
            type: Date,
            default: Date.now,
        }
    }],
    
    hires: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        hireDate: {
            type: Date,
            default: Date.now,
        }
    }],
    
    bookmarks: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        bookmark: {
             type: Boolean,
            default: false,
        }
    }],
    
    views: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        viewDate: {
            type: Date,
            default: Date.now,
        }
    }],
    applicationStatus: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending',
    },
    jobApplyId: [{
        apply:{
            type: Boolean,
            default: false,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        applyDate: {
            type: Date,
            default: Date.now,
        }
    }],
    AcceptedId: [{
        accept:{
            type: Boolean,
            default: false,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
    }],
         
    RejectedId: [{
        reject:{
            type: Boolean,
            default: false,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
    }],
         
    
    // Status
    isActive: {
        type: Boolean,
        default: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    
}, { timestamps: true });

const ClientJob = mongoose.model('ClientJob', jobSchema);

module.exports = ClientJob;
