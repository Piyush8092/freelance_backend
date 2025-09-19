let InfluencerModel = require('../../../Model/InfluencerRegiestrationModel');

const getAllFolloweing = async (req, res) => {
    try {
        let id = req.params.id; // influencer profile ID from URL
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        // Find the influencer profile
        let profile = await InfluencerModel.findById(id);
        if (!profile) {
            return res.status(404).json({
                message: 'Influencer profile not found',
                status: 404,
                data: {},
                success: false,
                error: true
            });
        }

        // Calculate pagination for following array
        const skip = (page - 1) * limit;
        const totalFollowing = profile.following.length;
        const totalPages = Math.ceil(totalFollowing / limit);

        // Get following with populate and apply manual pagination
        const populatedResult = await InfluencerModel.findById(id)
            .populate('following.userId', 'name email phone country role')
            .select('following');

        // Apply pagination to the following array
        const finalFollowing = populatedResult.following
            .slice(skip, skip + limit);

        res.json({
            message: 'Following retrieved successfully',
            status: 200,
            data: finalFollowing,
            success: true,
            error: false,
            total: totalFollowing,
            totalPages: totalPages,
            currentPage: page,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
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

module.exports = { getAllFolloweing };
