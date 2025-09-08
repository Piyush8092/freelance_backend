let mongoose = require('mongoose');

const sponsoredPostSchema = new mongoose.Schema({
    // Basic Post Information
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    
    // Sponsored Post Specific
    isSponsored: {
        type: Boolean,
        default: true,
    },
    sponsorType: {
        type: String,
        enum: ['Brand Partnership', 'Local Business', 'Product Promotion', 'Service Promotion'],
        default: 'Brand Partnership',
    },
    
    // Filter Categories
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Food & Dining', 'Fashion', 'Technology', 'Travel', 'Lifestyle', 'Health & Fitness', 'Beauty', 'Entertainment', 'Business', 'Education']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
    },
    budget: {
        type: Number,
        required: [true, 'Budget is required'],
        min: [0, 'Budget must be positive']
    },
    currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'EUR', 'INR', 'GBP']
    },
    
    // Media Content
    image: {
        type: String,
        required: [true, 'Image is required'],
    },
    additionalImages: [{
        type: String,
    }],
    
    // Campaign Details
    campaignDuration: {
        type: Number, // in days
        required: [true, 'Campaign duration is required'],
        min: [1, 'Campaign duration must be at least 1 day']
    },
    
    
    // User Reference (Brand/Sponsor)
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
    campaignStatus: {
        type: String,
        enum: ['Draft', 'Active', 'Paused', 'Completed', 'Cancelled'],
        default: 'Active',
    },
    
}, { timestamps: true });

// Index for better search performance
sponsoredPostSchema.index({ category: 1, location: 1, budget: 1 });
sponsoredPostSchema.index({ isActive: 1, campaignStatus: 1 });

const campaignsModel = mongoose.model('campaignsModel', sponsoredPostSchema);

module.exports = campaignsModel;