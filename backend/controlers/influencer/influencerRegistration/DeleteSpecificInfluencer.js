 
const InfluencerModel = require("../../../Model/InfluencerRegiestrationModel");

// delete specific influencer
const DeleteSpecificInfluencer = async (req, res) => {
    try {       
        let id = req.params.id;
        let userId = req.user._id;
  
        let ExistInfluencer = await InfluencerModel.findById(id);
        if (!ExistInfluencer) {
            return res.status(404).json({message: 'Influencer not found'});
        }

        // Check ownership
        if (ExistInfluencer.userId.toString() !== userId.toString() && req.user.role!=='ADMIN') {
            return res.status(403).json({message: 'Unauthorized access'});
        }
         
        const result = await InfluencerModel.findByIdAndDelete(id);
 
        res.json({
            message: 'Influencer deleted successfully', 
            status: 200, 
            data: result, 
            success: true, 
            error: false
        });

    } catch (e) {
        res.json({
            message: 'Something went wrong', 
            status: 500, 
            data: e.message, 
            success: false, 
            error: true
        });
    }
};

module.exports = { DeleteSpecificInfluencer };
