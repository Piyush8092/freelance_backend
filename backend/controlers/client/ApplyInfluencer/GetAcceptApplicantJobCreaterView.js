let ClientJob = require('../../../Model/clientJobModel');

const getAcceptJobClientView = async (req, res) => {
    try {
        let userId = req.user._id;

        // Authorization check - only clients and admins can view accepted applications
        if (req.user.role !== 'client' && req.user.role !== 'ADMIN') {
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
        // 2. The job has applications where JobApplyerAccept is true
        const result = await ClientJob.find({
            $and: [
                { 'jobApplyId.userId': userId },
                { 'jobApplyId.JobApplyerAccept': true }
            ]
        })
        .populate('userId', 'name email phone country role')
        .populate('jobApplyId.userId', 'name email phone country role')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

        // Count total documents with the same criteria
        const total = await ClientJob.countDocuments({
            $and: [
                { userId: userId },
                { 'jobApplyId.JobApplyerAccept': true }
            ]
        });
        const totalPages = Math.ceil(total / limit);

        // Filter to show only accepted applications for each job
        const processedResult = result.map(job => {
            const jobObj = job.toObject();
            
            // Filter jobApplyId to show only applications where JobApplyerAccept is true
            jobObj.jobApplyId = jobObj.jobApplyId.filter(
                application => application.JobApplyerAccept === true
            );
            
            return jobObj;
        });

        res.json({
            message: 'Jobs with accepted applications retrieved successfully', 
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


