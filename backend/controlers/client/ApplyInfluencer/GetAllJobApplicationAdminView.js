let ClientJob = require('../../../Model/clientJobModel');

const getAllJobApplicationAdminView = async (req, res) => {
    try {  
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        if(req.user.role !== 'ADMIN'){
            return res.status(403).json({
                message: 'Unauthorized access - Only admins can view all job applications',
                status: 403,
                success: false,
                error: true
            });
        }
        const result = await ClientJob.find()

        .populate('userId', 'name email profileImage')
            .populate('bids.userId', 'name email profileImage')
            .populate('hires.userId', 'name email profileImage')
            .populate('likes.userId', 'name email')
            .populate('views.userId', 'name email')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
            const total = await ClientJob.countDocuments();
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

module.exports = { getAllJobApplicationAdminView };



