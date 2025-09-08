let InfluencerModel = require('../../../Model/InfluencerRegiestrationModel');   
const getSpecificInfulencer = async (req, res) => {
    try {  
        let id = req.params.id;
        let result = await InfluencerModel.findById(id)
            .populate('likes.userId', 'name email profileImage')
            .populate('dislikes.userId', 'name email profileImage')
            .populate('comments.userId', 'name email profileImage')
            .populate('colaboration.postId', 'title description');
            
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
            message: 'Influencer retrieved successfully', 
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

module.exports = { getSpecificInfulencer };

