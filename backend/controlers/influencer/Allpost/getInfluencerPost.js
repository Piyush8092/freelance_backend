 let influencerPostModel = require('../../../Model/influencerPostModel');
const getInfluencerPost = async (req, res) => {
    try {  
        let page = req.query.page || 1;
        let limit = req.query.limit || 10;
        const skip = (page - 1) * limit;
        const result = await influencerPostModel.find().skip(skip).limit(limit);
        const total = await influencerPostModel.countDocuments();
        const totalPages = Math.ceil(total / limit);

        res.json({message: 'Post retrieved successfully', status: 200, data: result, success: true, error: false, total, totalPages});
    }
    catch (e) {
        res.json({message: 'Something went wrong', status: 500, data: e, success: false, error: true});

        }
};

module.exports = { getInfluencerPost };
