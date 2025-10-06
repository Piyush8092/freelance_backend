const ClientRegistrationModel = require("../../Model/clientRegistrationModel");
const InfluencerRegiestrationModel = require("../../Model/InfluencerRegiestrationModel");

 

const getSpecificUserDetail = async (req, res) => {
    try {  
             let loginUserId=req.user._id;
            //  console.log(req.user);
       if (!loginUserId) {
    return res.json({message: 'No data found', status: 400, data: {}, success: false, error: true});
}

let resultArray=[];

let ExistUser = await ClientRegistrationModel.find({userId: loginUserId}).populate('userId', 'name email phone country role');
 resultArray=[...resultArray,...ExistUser];
    ExistUser = await InfluencerRegiestrationModel.find({userId: loginUserId});
resultArray=[...resultArray,...ExistUser];
if (!resultArray.length===0) {
    return res.json({message: 'No data found', status: 400, data: {}, success: false, error: true});
}
         res.json({message: 'User detail retrieved successfully', status: 200, data: resultArray, success: true, error: false});
    }
        catch (e) {
            res.json({message: 'Something went wrong', status: 500, data: e, success: false, error: true});
        }
};

module.exports = { getSpecificUserDetail };

