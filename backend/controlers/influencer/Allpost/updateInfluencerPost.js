
let influencerPostModel = require('../../../Model/influencerPostModel');

const updateInfluencerPost = async (req, res) => {
    try {       
        let id = req.params.id;
        let payload = req.body;
        
        let ExistPost = await influencerPostModel.findById(id);
        if (!ExistPost) {
            return res.status(404).json({message: 'Post not found'});
        }

        let UserId = req.user._id;
        if (ExistPost.userId.toString() !== UserId.toString() && req.user.role!=='ADMIN') {
            return res.status(403).json({message: 'Unauthorized access'});
        }

        // Validate required fields if being updated
        if (payload.title && !payload.title.trim()) {
            return res.status(400).json({message: 'Title cannot be empty'});
        }
        
        if (payload.description && !payload.description.trim()) {
            return res.status(400).json({message: 'Description cannot be empty'});
        }

        // Mark as edited if content is being updated
        if (payload.title || payload.description || payload.Bannerimage) {
            payload.isEdited = true;
            payload.editedAt = new Date();
        }

        const result = await influencerPostModel.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        })
        .populate('userId', 'name email profileImage phone')
        .populate('likes.userId', 'name email profileImage')
        .populate('dislikes.userId', 'name email profileImage')
        .populate('shares.userId', 'name email profileImage')
        .populate('comments.userId', 'name email profileImage');
        
        res.json({
            message: 'Post updated successfully', 
            status: 200, 
            data: result, 
            success: true, 
            error: false
        });

    } catch (e) {
        // Handle validation errors
        if (e.name === 'ValidationError') {
            const errors = Object.values(e.errors).map(err => err.message);
            return res.status(400).json({
                message: 'Validation failed', 
                status: 400, 
                data: errors, 
                success: false, 
                error: true
            });
        }
        
        res.json({
            message: 'Something went wrong', 
            status: 500, 
            data: e.message, 
            success: false, 
            error: true
        });
    }
};

module.exports = { updateInfluencerPost };

