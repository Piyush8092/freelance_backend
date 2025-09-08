let influencerPostModel = require('../../../Model/influencerPostModel');

const getQueryPost = async (req, res) => {
    try {       
        let query = req.query.query;
        if (!query) {
            return res.status(400).json({message: 'Query parameter is required'});
        }

        let regexQuery = new RegExp(query, 'i');
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Search across multiple fields based on the post model
        const searchQuery = {
            $or: [
                { title: regexQuery },
                { description: regexQuery },
                { category: regexQuery },
            ]
        };

        const result = await influencerPostModel.find(searchQuery).skip(skip).limit(limit);
        const total = await influencerPostModel.countDocuments(searchQuery);
        const totalPages = Math.ceil(total / limit);

        if(!result || result.length === 0){
            return res.status(404).json({message: 'No data found'});
        }

        if(page < 1){
            return res.status(400).json({message: 'Invalid page number'});
        }

        if(page > totalPages){
            return res.status(400).json({message: 'Page number exceeds total pages'});
        }

        res.json({
            message: 'Posts retrieved successfully', 
            status: 200, 
            data: result,
            total,
            totalPages,
            currentPage: page,
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

module.exports = { getQueryPost };

