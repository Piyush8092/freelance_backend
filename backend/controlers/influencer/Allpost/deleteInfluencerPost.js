let influencerPostModel = require('../../../Model/influencerPostModel');

const deleteInfluencerPost = async (req, res) => {
    try {       
        let id = req.params.id;
        let userId = req.user._id;

        let ExistPost = await influencerPostModel.findById(id);
        if (!ExistPost) {
            return res.status(404).json({message: 'Post not found'});
        }

        if (ExistPost.userId.toString() !== userId.toString()) {
            return res.status(403).json({message: 'Unauthorized access'});
        }

        const result = await influencerPostModel.findByIdAndDelete(id);
        
        res.json({
            message: 'Post deleted successfully', 
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

module.exports = { deleteInfluencerPost };


