let InfluencerModel = require('../../../Model/InfluencerRegiestrationModel');   

const getAllInfluencer = async (req, res) => {
    try {  
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;
        const result = await InfluencerModel.find()
            .populate('likes.userId', 'name email profileImage')
            .populate('dislikes.userId', 'name email profileImage')
            .populate('comments.userId', 'name email profileImage')
            // .populate('colaboration.postId', 'title description') // Remove this line
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
            
        const total = await InfluencerModel.countDocuments();
        const totalPages = Math.ceil(total / limit);

        res.json({
            message: 'Influencer retrieved successfully', 
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

module.exports = { getAllInfluencer };
