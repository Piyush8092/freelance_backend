const e = require('express');
let ClientJobModel = require('../../../Model/clientJobModel');
let InfluencerModel = require('../../../Model/InfluencerRegiestrationModel');

const applyJob = async (req, res) => {
    try {
        let jobId = req.params.id;
        let userId = req.user._id;
        let { apply } = req.body;

        // Authorization check - only influencers can apply for jobs
        // if (req.user.role !== 'influencer') {
        //     return res.status(403).json({
        //         message: 'Unauthorized access - Only influencers can apply for jobs',
        //         status: 403,
        //         success: false,
        //         error: true
        //     });
        // }

        // Validate apply field
        if (apply !== true) {
            return res.status(400).json({
                message: 'Apply field must be true to apply for job',
                status: 400,
                success: false,
                error: true
            });
        }

        // Check if user has phone number
        if (!req.user.phone) {
            return res.status(400).json({
                message: 'Phone number is required to apply for jobs. Please update your profile.',
                status: 400,
                success: false,
                error: true
            });
        }

        // Check if influencer profile exists and is verified
        let ExistProfile = await InfluencerModel.findOne({ userId: userId });
        if (!ExistProfile ) {
            ExistProfile=await ClientJobModel.findOne({userId:userId});
            if(!ExistProfile && req.user.role!=='ADMIN'){
                return res.status(400).json({
                    message: 'Client profile not found. Please create your client profile first.',
                    status: 400,
                    success: false,
                    error: true
                });
            }
           
        }

        let existingJob = await ClientJobModel.findById(jobId);
        // console.log(existingJob);
        if (!existingJob) {
            return res.status(404).json({
                message: 'Job not found',
                status: 404,
                success: false,
                error: true
            });
        }

        // Check if job is active
        if (!existingJob.isActive) {
            return res.status(400).json({
                message: 'This job is no longer active',
                status: 400,
                success: false,
                error: true
            });
        }

        // Check if user is trying to apply to their own job
        if (existingJob.userId.toString() === userId.toString()) {
            return res.status(400).json({
                message: 'You cannot apply to your own job',
                status: 400,
                success: false,
                error: true
            });
        }

        // Check if user already applied
        const alreadyApplied = existingJob.jobApplyId.some(application =>
            application.userId.toString() === userId.toString() && application.apply === true
        );
        if (alreadyApplied) {
            return res.status(400).json({
                message: 'You have already applied for this job',
                status: 400,
                success: false,
                error: true
            });
        }

        // Check if user already accepted
        const alreadyAccepted = existingJob.AcceptedId.some(accepted =>
            accepted.userId.toString() === userId.toString() && accepted.accept === true
        );
        if (alreadyAccepted) {
            return res.status(400).json({
                message: 'You have already been accepted for this job',
                status: 400,
                success: false,
                error: true
            });
        }

        // Check if user already rejected
        const alreadyRejected = existingJob.RejectedId.some(rejected =>
            rejected.userId.toString() === userId.toString() && rejected.reject === true
        );
        if (alreadyRejected) {
            return res.status(400).json({
                message: 'You have been rejected for this job and cannot reapply',
                status: 400,
                success: false,
                error: true
            });
        }

        // Add user to job applications with correct structure
        existingJob.jobApplyId.push({
            apply: true,
            userId: userId,
            applyDate: new Date()
        });

        await existingJob.save();

        // Populate the result for response
        const populatedJob = await ClientJobModel.findById(jobId)
            .populate('userId', 'name email phone country role')
            .populate('jobApplyId.userId', 'name email phone country role')
            .populate('AcceptedId.userId', 'name email phone country role')
            .populate('RejectedId.userId', 'name email phone country role');

        res.json({
            message: 'Job application submitted successfully',
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

module.exports = { applyJob };
