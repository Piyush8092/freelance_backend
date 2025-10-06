 
let clientModel = require('../../Model/clientRegistrationModel');
const getClientUserDetail = async (req, res) => {


    try {  
        let userId=req.user._id;
         
        if(!userId){
            res.json({message: 'No data found', status: 400, data: {}, success: false, error: true});
        }
         
      let page = parseInt(req.query.page) || 1;
     let limit = parseInt(req.query.limit) || 10;
     const skip = (page - 1) * limit;

     let clientUser=await clientModel.find({userId: userId}).skip(skip).limit(limit).polopulate('userId', 'name email phone country role');
    let total = await clientModel.countDocuments({profileType:'client'});
    let totalPages = Math.ceil(total / limit);
    
    res.json({message: 'User detail retrieved successfully', status: 200, data: clientUser, success: true, error: false, total, totalPages});
    }


    catch (e) {
        res.json({message: 'Something went wrong', status: 500, data: e, success: false, error: true});
    }
};

module.exports = { getClientUserDetail };


