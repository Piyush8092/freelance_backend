let influencerPostModel = require('../../../Model/influencerPostModel');

const getSpecificInfluencerPost = async (req, res) => {
    try {  
        let id = req.params.id;
        
        let result = await influencerPostModel.findById(id)
            .populate('userId', 'name email profileImage phone')
            .populate('likes.userId', 'name email profileImage')
            .populate('dislikes.userId', 'name email profileImage')
            .populate('shares.userId', 'name email profileImage')
            .populate('comments.userId', 'name email profileImage');
            
        if(!result){
            return res.status(404).json({
                message: 'No data found', 
                status: 404, 
                data: {}, 
                success: false, 
                error: true
            });
        }
        
        res.json({
            message: 'Post retrieved successfully', 
            status: 200, 
            data: result, 
            success: true, 
            error: false
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

module.exports = { getSpecificInfluencerPost };
