let ClientModel = require('../../../Model/clientRegistrationModel');   
const getAllClient = async (req, res) => {
    try {  
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const result = await ClientModel.find()
            .populate('likes.userId', 'name email profileImage')
            .populate('dislikes.userId', 'name email profileImage')
            .populate('comments.userId', 'name email profileImage')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await ClientModel.countDocuments();
        const totalPages = Math.ceil(total / limit);

        res.json({
            message: 'Client retrieved successfully', 
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

module.exports = { getAllClient };


