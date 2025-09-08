 const ClientModel = require("../../../Model/clientRegistrationModel");
// put req for update client
const UpdateSpecificClient = async (req, res) => {
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
        
        // Find existing client
        let ExistClient = await ClientModel.findById(id);
        if (!ExistClient) {
            return res.status(404).json({message: 'Client not found'});
        }
        
        // Check ownership
        if (ExistClient.userId.toString() !== userId.toString()) {
            return res.status(403).json({message: 'Unauthorized access'});
        }
        
        // Validate profileType enum if being updated
        if (payload.profileType) {
            const validProfileTypes = ['client'];
            if (!validProfileTypes.includes(payload.profileType)) {
                return res.status(400).json({message: 'Invalid profile type'});
            }
        }
        
        // Profile type specific validation for updates
        const profileType = payload.profileType || ExistClient.profileType;
        
        if (payload.profileType && payload.profileType !== ExistClient.profileType) {
            // If changing profile type, validate all required fields for new type
            if (profileType === 'Business Profile') {
                if (!payload.businessName || !payload.establishedInYear || 
                    !payload.workBusinessImages || payload.workBusinessImages.length === 0) {
                    return res.status(400).json({message: 'All Business Profile fields are required when changing to Business Profile'});
                }
            } else if (profileType === 'Service Profile') {
                if (!payload.description) {
                    return res.status(400).json({message: 'Description is required for Service Profile'});
                }
            }
        }
        
        // Validate phone number when call via phone is enabled
        const allowCallViaPhone = payload.allowCallViaPhone !== undefined ? payload.allowCallViaPhone : ExistClient.allowCallViaPhone;
        if (allowCallViaPhone === true) {
            const phoneNumber = payload.phoneNumberForCalls || ExistClient.phoneNumberForCalls;
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
        
        // Validate image arrays based on profile type
        if (profileType === 'Business Profile') {
            if (payload.workBusinessImages && (!Array.isArray(payload.workBusinessImages) || payload.workBusinessImages.length === 0)) {
                return res.status(400).json({message: 'Work/Business images are required for Business Profile'});
            }
        }
        
        // Update the client
        const result = await ClientModel.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        });
        
        res.json({
            message: 'Client updated successfully', 
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

module.exports = { UpdateSpecificClient };
