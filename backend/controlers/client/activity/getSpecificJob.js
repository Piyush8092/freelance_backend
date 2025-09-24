let ClientJob = require('../../../Model/clientJobModel');

const getSpecificJob = async (req, res) => {
    try{
        let id = req.params.id;
        let result = await ClientJob.findById(id)
            .populate('userId', 'name email profileImage phone')
            .populate('bids.userId', 'name email profileImage')
            .populate('hires.userId', 'name email profileImage')
            .populate('bookmarks.userId', 'name email')
            .populate('views.userId', 'name email');
            
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
            message: 'Job retrieved successfully', 
            status: 200, 
            data: result, 
            success: true, 
            error: false
        });
    }
    catch(e){
        res.json({
            message: 'Something went wrong', 
            status: 500, 
            data: e.message, 
            success: false, 
            error: true
        });
    }
};

module.exports = { getSpecificJob };
