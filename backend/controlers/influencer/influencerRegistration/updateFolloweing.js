let InfluencerModel = require('../../../Model/InfluencerRegiestrationModel');

const updateFolloweing = async (req, res) => {
    try {
        let id = req.params.id; // profileId from URL
        let userId = req.user._id; // userId from auth middleware

            // Find the profile
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

            // Check if already following

                const alreadyFollowing = profile.following.some(
                    (f) => f.userId.toString() === userId.toString()
                );
                if (alreadyFollowing) {
                    return res.status(400).json({
                        message: 'You already following this profile',
                        status: 400,
                        data: {},
                        success: false,
                        error: true
                    });
                }
                    // Add following with default value true
                    profile.following.push({ 
                        userId: userId,
                        following: true
                    });
                    await profile.save();
                    res.status(200).json({
                        message: 'Following added successfully',
                        status: 200,
                        data: profile,
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

module.exports = { updateFolloweing };
