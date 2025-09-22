let ClientJob = require('../../../Model/clientJobModel');

const withdrawApplication = async (req, res) => {
    try {       
        let jobId = req.params.id;
        let currentUserId = req.user._id;
        let { applicantUserId } = req.body;

        // Determine which user's application to withdraw
        let targetUserId;
        
        if (req.user.role === 'ADMIN') {
            // Admin can withdraw any application
            if (!applicantUserId) {
                return res.status(400).json({
                    message: 'Admin must specify applicantUserId to withdraw application',
                    status: 400,
                    success: false,
                    error: true
                });
            }
            targetUserId = applicantUserId;
        } else if (req.user.role === 'influencer') {
            // Influencer can only withdraw their own application
            if (applicantUserId && applicantUserId !== currentUserId.toString()) {
                return res.status(403).json({
                    message: 'Influencers can only withdraw their own applications',
                    status: 403,
                    success: false,
                    error: true
                });
            }
            targetUserId = currentUserId;
        } else {
            return res.status(403).json({
                message: 'Unauthorized access - Only influencers and admins can withdraw applications',
                status: 403,
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

        // Check if the user actually applied for this job
        const applicationIndex = existingJob.jobApplyId.findIndex(
            application => application.userId.toString() === targetUserId.toString() && application.apply === true
        );

        if (applicationIndex === -1) {
            return res.status(400).json({
                message: 'No application found for this user on this job',
                status: 400,
                success: false,
                error: true
            });
        }

        // Check if the application has already been accepted
        const isAccepted = existingJob.AcceptedId.some(
            accepted => accepted.userId.toString() === targetUserId.toString() && accepted.accept === true
        );

        if (isAccepted) {
            return res.status(400).json({
                message: 'Cannot withdraw application - it has already been accepted',
                status: 400,
                success: false,
                error: true
            });
        }

        // Check if the application has already been rejected
        const isRejected = existingJob.RejectedId.some(
            rejected => rejected.userId.toString() === targetUserId.toString() && rejected.reject === true
        );

        if (isRejected) {
            return res.status(400).json({
                message: 'Cannot withdraw application - it has already been rejected',
                status: 400,
                success: false,
                error: true
            });
        }

        // Remove the application from jobApplyId array
        existingJob.jobApplyId.splice(applicationIndex, 1);

        // Also remove from any other arrays if present (cleanup)
        // Remove from AcceptedId if somehow present
        const acceptedIndex = existingJob.AcceptedId.findIndex(
            accepted => accepted.userId.toString() === targetUserId.toString()
        );
        if (acceptedIndex !== -1) {
            existingJob.AcceptedId.splice(acceptedIndex, 1);
        }

        // Remove from RejectedId if somehow present
        const rejectedIndex = existingJob.RejectedId.findIndex(
            rejected => rejected.userId.toString() === targetUserId.toString()
        );
        if (rejectedIndex !== -1) {
            existingJob.RejectedId.splice(rejectedIndex, 1);
        }

        await existingJob.save();

        // Populate the result for response
        const populatedJob = await ClientJob.findById(jobId)
            .populate('userId', 'name email phone country role')
            .populate('jobApplyId.userId', 'name email phone country role')
            .populate('AcceptedId.userId', 'name email phone country role')
            .populate('RejectedId.userId', 'name email phone country role')
            .populate('bookmarks.userId', 'name email phone country role');

        const message = req.user.role === 'ADMIN' 
            ? 'Application withdrawn successfully by admin' 
            : 'Application withdrawn successfully';

        res.json({
            message: message,
            status: 200,
            data: populatedJob,
            success: true,
            error: false
        });

    } catch (e) {
        res.status(500).json({
            message: 'Something went wrong',
            status: 500,
            data: e.message,
            success: false,
            error: true
        });
    }
};

module.exports = { withdrawApplication };
