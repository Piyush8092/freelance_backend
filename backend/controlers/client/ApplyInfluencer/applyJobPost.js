 let jobModel = require('../../../Model/clientJobModel');
const applyJob = async (req, res) => {
    try {       
        let id = req.params.id;
        let userId = req.user._id;
        let { apply } = req.body;

        // Validate apply field
        if (apply !== true) {
            return res.status(400).json({message: 'Apply field must be true to apply for job'});
        }

        let ExistJob = await jobModel.findById(id);
        if (!ExistJob) {
            return res.status(404).json({message: 'Job not found'});
        }

        // Check if user already applied
        if (ExistJob.jobApplyId && ExistJob.jobApplyId.includes(userId)) {
            return res.status(400).json({message: 'You have already applied for this job'});
        }

        // Check if user already accepted (handle both object and direct ID formats)
        if (ExistJob.AcceptedId && ExistJob.AcceptedId.length > 0) {
            const isAccepted = ExistJob.AcceptedId.some(accepted => {
                if (accepted.userId) {
                    return accepted.userId.toString() === userId.toString();
                }
                return accepted.toString() === userId.toString();
            });
            if (isAccepted) {
                return res.status(400).json({message: 'You have already been accepted for this job'});
            }
        }

        // Check if user already rejected (handle both object and direct ID formats)
        if (ExistJob.RejectedId && ExistJob.RejectedId.length > 0) {
            const isRejected = ExistJob.RejectedId.some(rejected => {
                if (rejected.userId) {
                    return rejected.userId.toString() === userId.toString();
                }
                return rejected.toString() === userId.toString();
            });
            if (isRejected) {
                return res.status(400).json({message: 'You have been rejected for this job'});
            }
        }

        // Initialize jobApplyId array if it doesn't exist
        if (!ExistJob.jobApplyId) {
            ExistJob.jobApplyId = [];
        }

        // Add user to job applications
        ExistJob.jobApplyId.push(userId);
        await ExistJob.save();

        res.json({
            message: 'Job applied successfully', 
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

module.exports = { applyJob };