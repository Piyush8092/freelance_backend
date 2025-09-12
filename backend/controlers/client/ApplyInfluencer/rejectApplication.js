let ClientJob = require('../../../Model/clientJobModel');

const rejectApplication = async (req, res) => {
    try {       
        let id = req.params.id;
        let userId = req.user._id;
        if(req.user.role!=='ADMIN' && req.user._id!==userId){
            return res.status(403).json({message: 'Unauthorized access'});
        }
        let ExistJob = await ClientJob.findById(id);
        if(!ExistJob.jobApplyId.includes(userId)) {
            return res.status(400).json({message: 'You have not applied for this job'});
        }

        if (!ExistJob) {
            return res.status(404).json({message: 'Job not found'});
        }
       
        if (ExistJob.AcceptedId.includes(userId)) {
            return res.status(400).json({message: 'You have already accepted for this job'});
        }
        if (ExistJob.RejectedId.includes(userId)) {
            return res.status(400).json({message: 'You have already rejected for this job'});
        }
        ExistJob.RejectedId.push(userId);
        await ExistJob.save();

        res.json({
            message: 'Application rejected successfully', 
            status: 200, 
            data: ExistJob, 
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

module.exports = { rejectApplication };



