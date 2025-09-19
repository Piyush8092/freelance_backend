let InfluencerModel = require('../../../Model/InfluencerRegiestrationModel');

const getAllFollower = async (req, res) => {
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

        // Calculate pagination for followers array
        const skip = (page - 1) * limit;
        const totalFollowers = profile.followers.length;
        const totalPages = Math.ceil(totalFollowers / limit);

        // Get followers with populate and apply manual pagination
        const populatedResult = await InfluencerModel.findById(id)
            .populate('followers.userId', 'name email phone country role')
            .select('followers');

        // Apply pagination to the followers array
        const finalFollowers = populatedResult.followers
            .slice(skip, skip + limit);

        res.json({
            message: 'Followers retrieved successfully',
            status: 200,
            data: finalFollowers,
            success: true,
            error: false,
            total: totalFollowers,
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

module.exports = { getAllFollower };