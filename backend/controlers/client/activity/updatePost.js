let ClientJob = require('../../../Model/clientJobModel');

const updateJob = async (req, res) => {
    try {       
        let id = req.params.id;
        let payload = req.body;
        
        let ExistJob = await ClientJob.findById(id);
        if (!ExistJob) {
            return res.status(404).json({message: 'Job not found'});
        }

        let UserId = req.user._id;
        if (ExistJob.userId.toString() !== UserId.toString() && req.user.role!=='ADMIN') {
            return res.status(403).json({message: 'Unauthorized access'});
        }

        // Validate budget range if both values are being updated
        const budgetFrom = payload.budgetFrom !== undefined ? payload.budgetFrom : ExistJob.budgetFrom;
        const budgetTo = payload.budgetTo !== undefined ? payload.budgetTo : ExistJob.budgetTo;
        if (budgetFrom >= budgetTo) {
            return res.status(400).json({message: 'Budget from must be less than budget to'});
        }

        // Validate currency if being updated
        if (payload.currency) {
            const validCurrency = ['INR', 'USD', 'EUR'];
            if (!validCurrency.includes(payload.currency)) {
                return res.status(400).json({message: 'Invalid currency'});
            }
        }

        // Validate phone number when call via phone is enabled
        const allowCallViaPhone = payload.allowCallViaPhone !== undefined ? payload.allowCallViaPhone : ExistJob.allowCallViaPhone;
        if (allowCallViaPhone === true) {
            const phoneNumber = payload.phoneNumberForCalls || ExistJob.phoneNumberForCalls;
            if (!phoneNumber) {
                return res.status(400).json({message: 'Phone number is required when call via phone is enabled'});
            }
        }

        const result = await ClientJob.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        });
        
        res.json({
            message: 'Job updated successfully', 
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

module.exports = { updateJob };
