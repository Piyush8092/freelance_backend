let ClientJob = require('../../../Model/clientJobModel');

const getRejectJobAppylerView = async (req, res) => {
    try {  
        let userId = req.user._id;
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const result = await ClientJob.find({
            $and: [
                {' jobApplyId.userId': userId },
                { 'jobApplyId.JobApplyerReject': true }
            ]
        })
        .populate('userId', 'name email phone country role')
        .populate('jobApplyId.userId', 'name email phone country role')
        .populate('AcceptedId.userId', 'name email phone country role')
        .populate('RejectedId.userId', 'name email phone country role')
        .populate('bids.userId', 'name email phone country role')
        .populate('hires.userId', 'name email phone country role')
        .populate('bookmarks.userId', 'name email phone country role')
        .populate('views.userId', 'name email phone country role')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
        const total = await ClientJob.countDocuments({
            $and: [
                {' jobApplyId.userId': userId },
                { 'jobApplyId.JobApplyerReject': true }
            ]
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

module.exports = { getRejectJobAppylerView };


