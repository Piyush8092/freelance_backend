let ClientJob = require('../../../Model/clientJobModel');

const getJobCreaterView = async (req, res) => {
    try {  
        let userId = req.user._id;
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const result = await ClientJob.find({userId: userId})
            .populate('userId', 'name email profileImage')
            .populate('bids.userId', 'name email profileImage')
            .populate('hires.userId', 'name email profileImage')
            .populate('likes.userId', 'name email')
            .populate('views.userId', 'name email')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
            
        const total = await ClientJob.countDocuments({userId: userId});
        const totalPages = Math.ceil(total / limit);

        res.json({
            message: 'Client jobs retrieved successfully', 
            status: 200, 
            data: result, 
            success: true, 
            error: false, 
            total, 
            totalPages,
            currentPage: page
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

module.exports = { getJobCreaterView };
