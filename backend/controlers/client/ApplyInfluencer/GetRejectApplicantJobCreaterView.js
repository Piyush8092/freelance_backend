let ClientJob = require('../../../Model/clientJobModel');

const getRejectJobJobCreaterView = async (req, res) => {
    try {
        let userId = req.user._id;

        // Authorization check
        if (req.user.role !== 'ADMIN' && req.user.role !== 'client') {
            return res.status(403).json({
                message: 'Unauthorized access - Only clients and admins can view rejected applications',
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
        // 2. The job has rejected applications (RejectedId array has entries with reject: true)
        const result = await ClientJob.find({
            userId: userId,
            'RejectedId.reject': true
        })
        .populate('userId', 'name email phone country role')
        .populate('RejectedId.userId', 'name email phone country role')
        .populate('jobApplyId.userId', 'name email phone country role')
        .populate('AcceptedId.userId', 'name email phone country role')
        .populate('bids.userId', 'name email phone country role')
        .populate('hires.userId', 'name email phone country role')
        .populate('likes.userId', 'name email phone country role')
        .populate('views.userId', 'name email phone country role')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

        // Count total documents with the same criteria
        const total = await ClientJob.countDocuments({
            userId: userId,
            'RejectedId.reject': true
        });
        const totalPages = Math.ceil(total / limit);

        res.json({
            message: 'Rejected applications retrieved successfully',
            status: 200,
            data: result,
            success: true,
            error: false,
            total,
            totalPages,
            currentPage: page,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        });
    }
    catch (e) {
        res.status(500).json({
            message: 'Something went wrong',
            status: 500,
            data: e.message,
            success: false,
            error: true
        });
    }
};

module.exports = { getRejectJobJobCreaterView };


