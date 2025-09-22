let ClientJob = require('../../../Model/clientJobModel');

const rejectApplication = async (req, res) => {
    try {
        let jobId = req.params.id;
        let clientUserId = req.user._id;
        let { applicantUserId } = req.body;

        // Authorization check - only clients and admins can reject applications
        if (req.user.role !== 'client' && req.user.role !== 'ADMIN') {
            return res.status(403).json({
                message: 'Unauthorized access - Only clients can reject applications',
                status: 403,
                success: false,
                error: true
            });
        }

        // Validate required fields
        if (!applicantUserId) {
            return res.status(400).json({
                message: 'Applicant user ID is required',
                status: 400,
                success: false,
                error: true
            });
        }

        let existingJob = await ClientJob.findById(jobId);
        if (!existingJob) {
            return res.status(404).json({
                message: 'Job not found',
                status: 404,
                success: false,
                error: true
            });
        }

        // Check if the current user is the job owner
        if (existingJob.userId.toString() !== clientUserId.toString() && req.user.role !== 'ADMIN') {
            return res.status(403).json({
                message: 'You can only reject applications for your own jobs',
                status: 403,
                success: false,
                error: true
            });
        }

        // Check if the applicant actually applied for this job
        const hasApplied = existingJob.jobApplyId.some(application =>
            application.userId.toString() === applicantUserId.toString() && application.apply === true
        );
        if (!hasApplied) {
            return res.status(400).json({
                message: 'This user has not applied for this job',
                status: 400,
                success: false,
                error: true
            });
        }

        // Check if already accepted
        const alreadyAccepted = existingJob.AcceptedId.some(accepted =>
            accepted.userId.toString() === applicantUserId.toString() && accepted.accept === true
        );
        if (alreadyAccepted) {
            return res.status(400).json({
                message: 'This application has already been accepted',
                status: 400,
                success: false,
                error: true
            });
        }

        // Check if already rejected
        const alreadyRejected = existingJob.RejectedId.some(rejected =>
            rejected.userId.toString() === applicantUserId.toString() && rejected.reject === true
        );
        if (alreadyRejected) {
            return res.status(400).json({
                message: 'This application has already been rejected',
                status: 400,
                success: false,
                error: true
            });
        }

        // Add to rejected list with correct structure
        existingJob.RejectedId.push({
            reject: true,
            userId: applicantUserId
        });

        await existingJob.save();

        // Populate the result for response
        const populatedJob = await ClientJob.findById(jobId)
            .populate('userId', 'name email phone country role')
            .populate('jobApplyId.userId', 'name email phone country role')
            .populate('AcceptedId.userId', 'name email phone country role')
            .populate('RejectedId.userId', 'name email phone country role');

        res.json({
            message: 'Application rejected successfully',
            status: 200,
            data: populatedJob,
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
};

module.exports = { rejectApplication };



