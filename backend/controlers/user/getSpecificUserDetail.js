let userModel = require('../../Model/userModel');

const getSpecificUserDetail = async (req, res) => {
    try {  
        let userId=req.params.id;
        if(!userId){
            res.json({message: 'No data found', status: 400, data: {}, success: false, error: true});
        }
        let result=await userModel.findById(userId);
        if(!result){
            res.json({message: 'No data found', status: 400, data: {}, success: false, error: true});
        }
        res.json({message: 'User detail retrieved successfully', status: 200, data: result, success: true, error: false});
    }
        catch (e) {
            res.json({message: 'Something went wrong', status: 500, data: e, success: false, error: true});
        }
};

module.exports = { getSpecificUserDetail };

