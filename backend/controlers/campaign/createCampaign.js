
let campaignsModel = require('../../Model/CampaignsModel');

const createCampaign = async (req, res) => {
    try {       
        let payload = req.body;

        // Validate all required fields
        if (!payload.title || !payload.description || !payload.category || 
            !payload.location || !payload.budget || !payload.image || 
            !payload.campaignDuration) {
            return res.status(400).json({message: 'All required fields must be provided'});
        }

        // Validate budget
        if (payload.budget <= 0) {
            return res.status(400).json({message: 'Budget must be greater than 0'});
        }

        // Validate campaign duration
        if (payload.campaignDuration < 1) {
            return res.status(400).json({message: 'Campaign duration must be at least 1 day'});
        }

        // Validate currency
        const validCurrency = ['USD', 'EUR', 'INR', 'GBP'];
        if (payload.currency && !validCurrency.includes(payload.currency)) {
            return res.status(400).json({message: 'Invalid currency'});
        }

        // Validate category
        const validCategories = ['Food & Dining', 'Fashion', 'Technology', 'Travel', 'Lifestyle', 'Health & Fitness', 'Beauty', 'Entertainment', 'Business', 'Education'];
        if (!validCategories.includes(payload.category)) {
            return res.status(400).json({message: 'Invalid category'});
        }

        let userId = req.user._id;
        if (!userId) {
            return res.status(400).json({message: 'User not authenticated'});
        }

        payload.userId = userId;
        payload.isSponsored = true;

        const newCampaign = new campaignsModel(payload);
        const result = await newCampaign.save();

        res.json({
            message: 'Campaign created successfully', 
            status: 200, 
            data: result, 
            success: true, 
            error: false
        });

    } catch (e) {
        // Handle validation errors
        if (e.name === 'ValidationError') {
            const errors = Object.values(e.errors).map(err => err.message);
            return res.status(400).json({
                message: 'Validation failed', 
                status: 400, 
                data: errors, 
                success: false, 
                error: true
            });
        }
        
        res.json({
            message: 'Something went wrong', 
            status: 500, 
            data: e.message, 
            success: false, 
            error: true
        });
    }
};

module.exports = { createCampaign };

