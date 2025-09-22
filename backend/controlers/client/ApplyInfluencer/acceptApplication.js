let ClientJob = require('../../../Model/clientJobModel');

const acceptApplication = async (req, res) => {
    try {       
        let id = req.params.id;
        let userId = req.user._id;
        let payload = req.body;
        let ExistJob = await ClientJob.findById(id);
        if(!ExistJob.jobApplyId.includes(userId)) {
            return res.status(400).json({message: 'You have not applied for this job'});
        }
        if (!ExistJob) {
            return res.status(404).json({message: 'Job not found'});
        }
        if (ExistJob.userId.toString() !== userId.toString() && req.user.role!=='ADMIN') {
            return res.status(403).json({message: 'Unauthorized access'});
        }
        if (ExistJob.AcceptedId.includes(userId)) {
            return res.status(400).json({message: 'You have already accepted for this job'});
        }
        if (ExistJob.RejectedId.includes(userId)) {
            return res.status(400).json({message: 'You have already rejected for this job'});
        }
        if(payload.accept !== true) {
            return res.status(400).json({message: 'Accept field must be true to accept application'});
        }
        ExistJob.AcceptedId.push(userId);
        await ExistJob.save();

        res.json({
            message: 'Application accepted successfully', 
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

module.exports = { acceptApplication };


