const InfluencerModel = require("../../../Model/InfluencerRegiestrationModel");

// put req for update influencer
const UpdateSpecificInfluencer = async (req, res) => {
    try {
        // Validate JSON payload first
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: 'Invalid or empty JSON payload',
                status: 400,
                success: false,
                error: true
            });
        }

        let id = req.params.id;
        let userId = req.user._id;
        let payload = req.body;
        
        // Find existing influencer
        let ExistInfluencer = await InfluencerModel.findById(id);
        if (!ExistInfluencer) {
            return res.status(404).json({message: 'Influencer not found'});
        }
        
        // Check ownership
        if (ExistInfluencer.userId.toString() !== userId.toString()) {
            return res.status(403).json({message: 'Unauthorized access'});
        }
        
        // Validate profileType enum if being updated
        if (payload.profileType) {
            const validProfileTypes = ['influencer'];
            if (!validProfileTypes.includes(payload.profileType)) {
                return res.status(400).json({message: 'Invalid profile type'});
            }
        }
        
        // Validate phone number when call via phone is enabled
        const allowCallViaPhone = payload.allowCallViaPhone !== undefined ? payload.allowCallViaPhone : ExistInfluencer.allowCallViaPhone;
        if (allowCallViaPhone === true) {
            const phoneNumber = payload.phoneNumberForCalls || ExistInfluencer.phoneNumberForCalls;
            if (!phoneNumber) {
                return res.status(400).json({message: 'Phone number is required when call via phone is enabled'});
            }
        }
        
        // Email validation if being updated
        if (payload.email) {
            const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            if (!emailRegex.test(payload.email)) {
                return res.status(400).json({message: 'Please enter a valid email'});
            }
        }
        
        // Update the influencer
        const result = await InfluencerModel.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        });
        
        res.json({
            message: 'Influencer updated successfully', 
            status: 200, 
            data: result, 
            success: true, 
            error: false
        });

    } catch (e) {
        // Handle JSON parsing errors
        if (e instanceof SyntaxError && e.message.includes('JSON')) {
            return res.status(400).json({
                message: 'Invalid JSON format in request body',
                status: 400,
                success: false,
                error: true
            });
        }
        
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

module.exports = { UpdateSpecificInfluencer };
