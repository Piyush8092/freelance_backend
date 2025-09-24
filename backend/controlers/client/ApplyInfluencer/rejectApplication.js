let ClientJob = require('../../../Model/clientJobModel');

const rejectApplication = async (req, res) => {
         try {       
        let jobId = req.params.jobId;
        let index = parseInt(req.params.index);
        let userId = req.user._id;
        let { JobCreaterReject } = req.body;
        
      
        // Validate Reject field
        if (JobCreaterReject !== true) {
            return res.status(400).json({
                message: 'Reject field must be true to Reject application',
                status: 400,
                success: false,
                error: true
            });
        }
        
        // Validate index parameter
        if (isNaN(index) || index < 0) {
            return res.status(400).json({
                message: 'Valid index is required',
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
        
        // Check if the current user is the job creator or admin
        if (ExistJob.userId.toString() !== userId.toString() && req.user.role !== 'ADMIN') {
            return res.status(403).json({
                message: 'You can only Reject applications for your own jobs',
                status: 403,
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
        
        // Check if index is valid
        if (index >= ExistJob.jobApplyId.length) {
            return res.status(404).json({
                message: 'Application index not found',
                status: 404,
                success: false,
                error: true
            });
        }
        
        // Check if already Rejected
        if (ExistJob.jobApplyId[index].JobCreaterReject === true) {
            return res.status(400).json({
                message: 'Application has already been Rejected',
                status: 400,
                success: false,
                error: true
            });
        }
        
        // Check if already rejected
        if (ExistJob.jobApplyId[index].JobCreaterAccept === true) {
            return res.status(400).json({
                message: 'Application has already been Accepted',
                status: 400,
                success: false,
                error: true
            });
        }
        
        // Reject the application
        ExistJob.jobApplyId[index].JobCreaterReject = true;
        await ExistJob.save();

        res.json({
            message: 'Application Rejected successfully', 
            status: 200, 
            data: ExistJob, 
            success: true, 
            error: false
        });

    }
    catch (e) {
        res.status(500).json({
            message: 'Something went wrong', 
            status: 500, 
            data: e.message, 
            success: false, 
            error: true
        });
    }


}


module.exports = { rejectApplication };



