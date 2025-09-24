let ClientJob = require('../../../Model/clientJobModel');

const createJob = async (req, res) => {
    try {       
        let payload = req.body;
        
        // Validate all required fields
        if (!payload.title || !payload.selectCategory || !payload.description || 
            !payload.budgetFrom || !payload.budgetTo || !payload.projectDuration ||
            payload.allowCallInApp === undefined || payload.allowCallViaPhone === undefined ||
            payload.allowChat === undefined) {
            return res.status(400).json({message: 'All required fields must be provided'});
        }

        // Validate budget range
        if (payload.budgetFrom >= payload.budgetTo) {
            return res.status(400).json({message: 'Budget from must be less than budget to'});
        }

        // Validate currency
        const validCurrency = ['INR', 'USD', 'EUR'];
        if (payload.currency && !validCurrency.includes(payload.currency)) {
            return res.status(400).json({message: 'Invalid currency'});
        }

        // Validate phone number when call via phone is enabled
        if (payload.allowCallViaPhone === true && !payload.phoneNumberForCalls && !req.user.phone) {
            return res.status(400).json({message: 'Phone number is required when call via phone is enabled'});
        }
 

        payload.userId = req.user._id;
        console.log(req.user)
        if (!payload.phoneNumberForCalls && req.user.phone) {
            payload.phoneNumberForCalls = req.user.phone;
        }

        const newJob = new ClientJob(payload);
        const result = await newJob.save();

        res.json({
            message: 'Job created successfully', 
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

module.exports = { createJob };
