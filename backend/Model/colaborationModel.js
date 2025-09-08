
let mongoose = require('mongoose');

const colaborationSchema = new mongoose.Schema({
    // Campaign Information
    campaignTitle: {
        type: String,
        required: [true, 'Campaign title is required'],
    },
    campaignDescription: {
        type: String,
        required: [true, 'Campaign description is required'],
    },
    
    // Brand Information
    brandName: {
        type: String,
        required: [true, 'Brand name is required'],
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Brand user is required'],
    },
    
    // Influencer Information
    influencerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Influencer is required'],
    },
    
    // Campaign Reference
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'campaignsModel',
        required: [true, 'Campaign reference is required'],
    },
    
    // Date Information
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
    },
    
    // Status Information
    status: {
        type: String,
        enum: ['Pending', 'Active', 'Completed', 'Cancelled', 'Paused'],
        default: 'Pending',
    },
    
    // Collaboration Details
    agreedBudget: {
        type: Number,
        required: [true, 'Agreed budget is required'],
        min: [0, 'Budget must be positive']
    },
    currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'EUR', 'INR', 'GBP']
    },
    
    // Deliverables
    deliverables: [{
        description: {
            type: String,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed', 'Rejected'],
            default: 'Pending',
        },
        submittedAt: {
            type: Date,
        },
        approvedAt: {
            type: Date,
        }
    }],
    
    // Contract Terms
    contractTerms: {
        type: String,
    },
    paymentTerms: {
        type: String,
        enum: ['Upfront', '50-50', 'On Completion', 'Milestone Based'],
        default: 'On Completion',
    },
    
    // Progress Tracking
    progressPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    
    // Communication
    messages: [{
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        messageDate: {
            type: Date,
            default: Date.now,
        }
    }],
    
    // Files/Media
    attachments: [{
        fileName: {
            type: String,
            required: true,
        },
        fileUrl: {
            type: String,
            required: true,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        uploadDate: {
            type: Date,
            default: Date.now,
        }
    }],
    
    // Status Tracking
    isActive: {
        type: Boolean,
        default: true,
    },
    
}, { timestamps: true });

// Validate end date is after start date
colaborationSchema.pre('save', function(next) {
    if (this.endDate <= this.startDate) {
        next(new Error('End date must be after start date'));
    }
    next();
});

// Index for better search performance
colaborationSchema.index({ brandId: 1, influencerId: 1 });
colaborationSchema.index({ status: 1, startDate: 1 });
colaborationSchema.index({ campaignId: 1 });

const ColaborationModel = mongoose.model('Colaboration', colaborationSchema);

module.exports = ColaborationModel;

