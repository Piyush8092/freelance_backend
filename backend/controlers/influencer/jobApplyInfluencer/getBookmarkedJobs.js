const ClientJob = require('../../../Model/clientJobModel');

const getBookmarkedJobs = async (req, res) => {
    try {  
        let userId = req.user._id;
        
        // Authorization check - only influencers can view their bookmarked jobs
        if(req.user.role !== 'influencer' && req.user.role !== 'ADMIN'){
            return res.status(403).json({
                message: 'Unauthorized access - Only influencers can view bookmarked jobs',
                status: 403,
                success: false,
                error: true
            });
        }

        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Query for jobs where:
        // 1. The current user has bookmarked the job (in bookmarks array with bookmark: true)
        // 2. The job is active
        const result = await ClientJob.find({
            'bookmarks.userId': userId,
            'bookmarks.bookmark': true,
            isActive: true
        })
        .populate('userId', 'name email phone country role')
        .populate('bookmarks.userId', 'name email phone country role')
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
            'bookmarks.userId': userId,
            'bookmarks.bookmark': true,
            isActive: true
        });
        const totalPages = Math.ceil(total / limit);

        // Filter the bookmarks for each job to show only current user's bookmark
        const processedResult = result.map(job => {
            const jobObj = job.toObject();
            
            // Filter bookmarks to show only current user's bookmark
            jobObj.bookmarks = jobObj.bookmarks.filter(
                bookmark => bookmark.userId._id.toString() === userId.toString() && bookmark.bookmark === true
            );
            
            // Add a flag to indicate if current user has applied
            jobObj.hasApplied = jobObj.jobApplyId.some(
                application => application.userId._id.toString() === userId.toString() && application.apply === true
            );
            
            // Add a flag to indicate if current user has been accepted
            jobObj.isAccepted = jobObj.AcceptedId.some(
                accepted => accepted.userId._id.toString() === userId.toString() && accepted.accept === true
            );
            
            // Add a flag to indicate if current user has been rejected
            jobObj.isRejected = jobObj.RejectedId.some(
                rejected => rejected.userId._id.toString() === userId.toString() && rejected.reject === true
            );
            
            return jobObj;
        });

        res.json({
            message: 'Bookmarked jobs retrieved successfully', 
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

module.exports = { getBookmarkedJobs };
