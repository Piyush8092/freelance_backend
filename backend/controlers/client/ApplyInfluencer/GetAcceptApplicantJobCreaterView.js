let ClientJob = require('../../../Model/clientJobModel');

const getAcceptJobClientView = async (req, res) => {
    try {
        let userId = req.user._id;

        // Authorization check
        if(req.user.role !== 'ADMIN' && req.user.role !== 'client'){
            return res.status(403).json({
                message: 'Unauthorized access - Only clients and admins can view accepted applications',
                status: 403,
                success: false,
                error: true
            });
        }

        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Query for jobs where:
        // 1. The current user is the job creator (userId matches)
        // 2. The job has accepted applications (AcceptedId array has entries with accept: true)
        const result = await ClientJob.find({
            userId: userId,
            'AcceptedId.accept': true
        })
        .populate('userId', 'name email phone country role')
        .populate('AcceptedId.userId', 'name email phone country role')
        .populate('bids.userId', 'name email phone country role')
        .populate('hires.userId', 'name email phone country role')
        .populate('likes.userId', 'name email phone country role')
        .populate('views.userId', 'name email phone country role')
        .populate('jobApplyId.userId', 'name email phone country role')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

        // Count total documents with the same criteria
        const total = await ClientJob.countDocuments({
            userId: userId,
            'AcceptedId.accept': true
        });
        const totalPages = Math.ceil(total / limit);

        res.json({
            message: 'Jobs retrieved successfully', 
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

module.exports = { getAcceptJobClientView };


