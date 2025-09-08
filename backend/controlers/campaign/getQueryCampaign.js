let campaignsModel = require('../../Model/CampaignsModel');

const queryCampaigns = async (req, res) => {
    try {       
        let query = req.query.query;
        if (!query) {
            return res.status(400).json({message: 'Query parameter is required'});
        }
        
        let regexQuery = new RegExp(query, 'i');
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Search across multiple fields based on the campaign model
        const searchQuery = {
            $or: [
                { title: regexQuery },
                { description: regexQuery },
                { category: regexQuery },
                { location: regexQuery },
                { sponsorType: regexQuery },
                { campaignStatus: regexQuery }
            ]
        };
        
        const result = await campaignsModel.find(searchQuery)
            .populate('userId', 'name email profileImage phone')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
            
        const total = await campaignsModel.countDocuments(searchQuery);
        const totalPages = Math.ceil(total / limit);

        res.json({
            message: 'Campaigns retrieved successfully', 
            status: 200, 
            data: result, 
            success: true, 
            error: false, 
            total, 
            totalPages,
            currentPage: page,
            searchQuery: query
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

module.exports = { queryCampaigns };