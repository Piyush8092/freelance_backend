let influencerModel = require('../../Model/InfluencerRegiestrationModel');
let clientModel = require('../../Model/clientRegistrationModel');


const getSpecificUserDetail = async (req, res) => {
    try {  
        let userId=req.params.id;
            let loginUserId=req.user._id;
      if (!loginUserId) {
    return res.json({message: 'No data found', status: 400, data: {}, success: false, error: true});
}

let ExistUser = await clientModel.findById(userId);
if (!ExistUser) {
    ExistUser = await influencerModel.findById(userId);
}
if (!ExistUser) {
    return res.json({message: 'No data found', status: 400, data: {}, success: false, error: true});
}
let result = ExistUser;
        res.json({message: 'User detail retrieved successfully', status: 200, data: result, success: true, error: false});
    }
        catch (e) {
            res.json({message: 'Something went wrong', status: 500, data: e, success: false, error: true});
        }
};

module.exports = { getSpecificUserDetail };

