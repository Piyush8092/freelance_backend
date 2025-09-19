let ClientModel = require('../../../Model/clientRegistrationModel');   
const getQueryClient = async (req, res) => {
    try {       
        let query = req.query.query;
        if (!query) {
            return res.status(400).json({message: 'Query parameter is required'});
        }

        let regexQuery = new RegExp(query, 'i');
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Search across multiple fields based on the client model
        const searchQuery = {
            $or: [
                { name: regexQuery },
                { businessName: regexQuery },
                { selectCategory: regexQuery },
                { description: regexQuery },
                { email: regexQuery },
                { establishedInYear: regexQuery }
            ]
        };
        const result = await ClientModel.find(searchQuery).populate('colaboration.postId', 'title description')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
            const total = await ClientModel.countDocuments(searchQuery);
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
            message: 'Clients retrieved successfully', 
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

module.exports = { getQueryClient };



