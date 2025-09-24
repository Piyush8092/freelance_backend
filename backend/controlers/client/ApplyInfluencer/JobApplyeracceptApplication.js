
let ClientJob = require('../../../Model/clientJobModel');

const JobApplyeracceptApplication = async (req, res) => {
    try {       
        let jobId = req.params.jobId;
        let userId = req.user._id;
        let { JobApplyerAccept } = req.body;
        
        // Validate accept field
        if (JobApplyerAccept !== true) {
            return res.status(400).json({
                message: 'JobApplyerAccept field must be true to accept application',
                status: 400,
                success: false,
                error: true
            });
        }
        
        let ExistJob = await ClientJob.findById(jobId);
        
        if (!ExistJob) {
            return res.status(404).json({
                message: 'Job not found',
                status: 404,
                success: false,
                error: true
            });
        }
        
        // Check if applications exist
        if (ExistJob.jobApplyId.length === 0) {
            return res.status(404).json({
                message: 'No applications found for this job',
                status: 404,
                success: false,
                error: true
            });
        }
        
        // Find the application index for current user
        const applicationIndex = ExistJob.jobApplyId.findIndex(
            application => application.userId.toString() === userId.toString()
        );
        
        if (applicationIndex === -1) {
            return res.status(404).json({
                message: 'You have not applied for this job',
                status: 404,
                success: false,
                error: true
            });
        }
        
        // Check if already accepted by job applyer
        if (ExistJob.jobApplyId[applicationIndex].JobApplyerAccept === true) {
            return res.status(400).json({
                message: 'You have already accepted this job',
                status: 400,
                success: false,
                error: true
            });
        }
        
        // Check if already rejected by job applyer
        if (ExistJob.jobApplyId[applicationIndex].JobApplyerReject === true) {
            return res.status(400).json({
                message: 'You have already rejected this job',
                status: 400,
                success: false,
                error: true
            });
        }
        
        // Check if job creator has accepted the application first
        if (ExistJob.jobApplyId[applicationIndex].JobCreaterAccept !== true) {
            return res.status(400).json({
                message: 'Job creator must accept your application first',
                status: 400,
                success: false,
                error: true
            });
        }
        
        // Accept the application as job applyer
        ExistJob.jobApplyId[applicationIndex].JobApplyerAccept = true;
        await ExistJob.save();

        res.json({
            message: 'Job accepted successfully by applicant', 
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

module.exports = { JobApplyeracceptApplication };

