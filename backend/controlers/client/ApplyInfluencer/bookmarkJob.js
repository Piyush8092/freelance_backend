let ClientJob = require('../../../Model/clientJobModel');

const bookmarkJob = async (req, res) => {
    try {       
        let jobId = req.params.id;
        let userId = req.user._id;
        let { bookmark } = req.body;

        // Authorization check - only influencers can bookmark jobs
        if (req.user.role !== 'influencer' && req.user.role !== 'ADMIN') {
            return res.status(403).json({
                message: 'Unauthorized access - Only influencers can bookmark jobs',
                status: 403,
                success: false,
                error: true
            });
        }

        // Validate bookmark field
        if (typeof bookmark !== 'boolean') {
            return res.status(400).json({
                message: 'Bookmark field must be a boolean value (true or false)',
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

        // Check if job is active
        if (!existingJob.isActive) {
            return res.status(400).json({
                message: 'Cannot bookmark inactive jobs',
                status: 400,
                success: false,
                error: true
            });
        }

        // Check if user already bookmarked this job
        const existingBookmarkIndex = existingJob.bookmarks.findIndex(
            bookmarkItem => bookmarkItem.userId.toString() === userId.toString()
        );

        if (bookmark === true) {
            // Add bookmark
            if (existingBookmarkIndex !== -1) {
                // Update existing bookmark
                existingJob.bookmarks[existingBookmarkIndex].bookmark = true;
            } else {
                // Add new bookmark
                existingJob.bookmarks.push({
                    userId: userId,
                    bookmark: true
                });
            }
        } else {
            // Remove bookmark
            if (existingBookmarkIndex !== -1) {
                // Remove the bookmark entry
                existingJob.bookmarks.splice(existingBookmarkIndex, 1);
            } else {
                return res.status(400).json({
                    message: 'Job is not bookmarked by this user',
                    status: 400,
                    success: false,
                    error: true
                });
            }
        }

        await existingJob.save();

        // Populate the result for response
        const populatedJob = await ClientJob.findById(jobId)
            .populate('userId', 'name email phone country role')
            .populate('bookmarks.userId', 'name email phone country role')
            .populate('jobApplyId.userId', 'name email phone country role')
            .populate('AcceptedId.userId', 'name email phone country role')
            .populate('RejectedId.userId', 'name email phone country role');

        const message = bookmark ? 'Job bookmarked successfully' : 'Job bookmark removed successfully';

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

module.exports = { bookmarkJob };
