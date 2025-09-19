let userModel = require('../../Model/userModel');

const getAllUserFromUserModel = async (req, res) => {
    try {  

        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const result = await userModel.find().skip(skip).limit(limit);
        const total = await userModel.countDocuments();
        const totalPages = Math.ceil(total / limit);

        res.json({
            message: 'User retrieved successfully', 
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

module.exports = { getAllUserFromUserModel };


