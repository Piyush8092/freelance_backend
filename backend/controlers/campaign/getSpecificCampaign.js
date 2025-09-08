
let campaignsModel = require('../../Model/CampaignsModel');

const getSpecificCampaign = async (req, res) => {
    try {  
        let id = req.params.id;
        
        let result = await campaignsModel.findById(id)
            .populate('userId', 'name email profileImage phone');
            
        if(!result){
            return res.status(404).json({
                message: 'Campaign not found', 
                status: 404, 
                data: {}, 
                success: false, 
                error: true
            });
        }
        
        res.json({
            message: 'Campaign retrieved successfully', 
            status: 200, 
            data: result, 
            success: true, 
            error: false
        });
    }
    catch (e) {
        res.json({
            message: 'Something went wrong', 
            status: 500, 
            data: e.message, 
            success: false, 
            error: true
        });
    }
};

module.exports = { getSpecificCampaign };

