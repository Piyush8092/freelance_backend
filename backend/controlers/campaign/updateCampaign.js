
let campaignsModel = require('../../Model/CampaignsModel');

const updateCampaign = async (req, res) => {
    try {       
        let id = req.params.id;
        let payload = req.body;
        
        let ExistCampaign = await campaignsModel.findById(id);
        if (!ExistCampaign) {
            return res.status(404).json({message: 'Campaign not found'});
        }

        let UserId = req.user._id;
        if (ExistCampaign.userId.toString() !== UserId.toString()) {
            return res.status(403).json({message: 'Unauthorized access'});
        }

        // Validate required fields if being updated
        if (payload.title && !payload.title.trim()) {
            return res.status(400).json({message: 'Title cannot be empty'});
        }
        
        if (payload.description && !payload.description.trim()) {
            return res.status(400).json({message: 'Description cannot be empty'});
        }

        // Validate budget
        if (payload.budget !== undefined && payload.budget <= 0) {
            return res.status(400).json({message: 'Budget must be greater than 0'});
        }

        // Validate campaign duration
        if (payload.campaignDuration !== undefined && payload.campaignDuration < 1) {
            return res.status(400).json({message: 'Campaign duration must be at least 1 day'});
        }

        // Validate currency
        if (payload.currency) {
            const validCurrency = ['USD', 'EUR', 'INR', 'GBP'];
            if (!validCurrency.includes(payload.currency)) {
                return res.status(400).json({message: 'Invalid currency'});
            }
        }

        // Validate category
        if (payload.category) {
            const validCategories = ['Food & Dining', 'Fashion', 'Technology', 'Travel', 'Lifestyle', 'Health & Fitness', 'Beauty', 'Entertainment', 'Business', 'Education'];
            if (!validCategories.includes(payload.category)) {
                return res.status(400).json({message: 'Invalid category'});
            }
        }

        // Validate campaign status
        if (payload.campaignStatus) {
            const validStatuses = ['Draft', 'Active', 'Paused', 'Completed', 'Cancelled'];
            if (!validStatuses.includes(payload.campaignStatus)) {
                return res.status(400).json({message: 'Invalid campaign status'});
            }
        }

        const result = await campaignsModel.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        });
        
        res.json({
            message: 'Campaign updated successfully', 
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

module.exports = { updateCampaign };

