const ClientJob = require('../../../Model/clientJobModel');

const getRejectedJobs = async (req, res) => {
    try {
        let userId = req.user._id;

        // Authorization check - only influencers can view their rejected jobs
        if(req.user.role !== 'influencer' && req.user.role !== 'ADMIN'){
            return res.status(403).json({
                message: 'Unauthorized access - Only influencers can view rejected jobs',
                status: 403,
                success: false,
                error: true
            });
        }

        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Query for jobs where:
        // 1. The current user has applied (in jobApplyId array)
        // 2. The current user has been rejected (in RejectedId array with reject: true)
        const result = await ClientJob.find({
            'jobApplyId.userId': userId,
            'jobApplyId.JobApplyerReject': true,
             
        })
        .populate('userId', 'name email phone country role')
        .populate('jobApplyId.userId', 'name email phone country role')
        .populate('AcceptedId.userId', 'name email phone country role')
        .populate('RejectedId.userId', 'name email phone country role')
        .populate('bids.userId', 'name email phone country role')
        .populate('hires.userId', 'name email phone country role')
        .populate('likes.userId', 'name email phone country role')
        .populate('views.userId', 'name email phone country role')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

        // Count total documents with the same criteria
        const total = await ClientJob.countDocuments({
            'jobApplyId.userId': userId,
            'jobApplyId.apply': true,
            'RejectedId.userId': userId,
            'RejectedId.reject': true
        });
        const totalPages = Math.ceil(total / limit);

        // Filter the rejected applications for each job to show only current user's rejection
        const processedResult = result.map(job => {
            const jobObj = job.toObject();

            // Filter RejectedId to show only current user's rejection
            jobObj.RejectedId = jobObj.RejectedId.filter(
                rejected => rejected.userId._id.toString() === userId.toString() && rejected.reject === true
            );

            // Filter jobApplyId to show only current user's application
            jobObj.jobApplyId = jobObj.jobApplyId.filter(
                application => application.userId._id.toString() === userId.toString() && application.apply === true
            );

            return jobObj;
        });

        res.json({
            message: 'Rejected jobs retrieved successfully',
            status: 200,
            data: processedResult,
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

module.exports = { getRejectedJobs };