let influencerPostModel = require('../../../Model/influencerPostModel');
let userModel=require('../../../Model/userModel');
const createInfluencerPost = async (req, res) => {
    try {       
        let payload = req.body;

        // Validate all required fields
        if (!payload.title || !payload.description || !payload.Bannerimage ) {
            return res.status(400).json({message: 'All required fields must be provided'});
        }

        let userId = req.user._id;
        if (!userId) {
            return res.status(400).json({message: 'User not authenticated'});
        }

        payload.userId = userId;
        let existInfluencer=await userModel.findById(userId);
        payload.profileImage = existInfluencer.profileImage;
         payload.isVerified = true;
 
        const newPost = new influencerPostModel(payload);
        const result = await newPost.save();

        res.json({
            message: 'Post created successfully', 
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

module.exports = { createInfluencerPost };

