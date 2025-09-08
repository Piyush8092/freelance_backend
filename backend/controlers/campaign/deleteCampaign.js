
let campaignsModel = require('../../Model/CampaignsModel');

const deleteCampaign = async (req, res) => {
    try {       
        let id = req.params.id;
        let userId = req.user._id;
        
        let ExistCampaign = await campaignsModel.findById(id);
        if (!ExistCampaign) {
            return res.status(404).json({message: 'Campaign not found'});
        }
        
        if (ExistCampaign.userId.toString() !== userId.toString()) {
            return res.status(403).json({message: 'Unauthorized access'});
        }

        const result = await campaignsModel.findByIdAndDelete(id);
        
        res.json({
            message: 'Campaign deleted successfully', 
            status: 200, 
            data: result, 
            success: true, 
            error: false
        });

    } catch (e) {
        res.json({
            message: 'Something went wrong', 
            status: 500, 
            data: e.message, 
            success: false, 
            error: true
        });
    }
};

module.exports = { deleteCampaign };

