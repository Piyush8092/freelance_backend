let ClientJob = require('../../../Model/clientJobModel');

const queryJobs = async (req, res) => {
    try {       
        let query = req.query.query;
        if (!query) {
            return res.status(400).json({message: 'Query parameter is required'});
        }
        
        let regexQuery = new RegExp(query, 'i');
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Search across multiple fields based on the client job model
        const searchQuery = {
            $or: [
                { title: regexQuery },
                { description: regexQuery },
                { selectCategory: regexQuery },
                { selectSubCategory: regexQuery },
                { projectDuration: regexQuery },
                { currency: regexQuery },
                { budgetFrom: !isNaN(query) ? Number(query) : null },
                { budgetTo: !isNaN(query) ? Number(query) : null }
            ].filter(condition => condition !== null && Object.values(condition)[0] !== null)
        };
        
        const result = await ClientJob.find(searchQuery)
            .populate('userId', 'name email profileImage')
            .populate('bids.userId', 'name email profileImage')
            .populate('hires.userId', 'name email profileImage')
            .populate('bookmarks.userId', 'name email')
            .populate('views.userId', 'name email')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
            
        const total = await ClientJob.countDocuments(searchQuery);
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
            message: 'Jobs retrieved successfully', 
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

module.exports = { queryJobs };
