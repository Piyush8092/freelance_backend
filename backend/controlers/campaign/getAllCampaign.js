let campaignsModel = require('../../Model/CampaignsModel');

const getAllCampaigns = async (req, res) => {
    try {  
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const result = await campaignsModel.find()
            .populate('userId', 'name email profileImage phone')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
            
        const total = await campaignsModel.countDocuments();
        const totalPages = Math.ceil(total / limit);

        res.json({
            message: 'Campaigns retrieved successfully', 
            status: 200, 
            data: result, 
            success: true, 
            error: false, 
            total, 
            totalPages,
            currentPage: page
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

module.exports = { getAllCampaigns };