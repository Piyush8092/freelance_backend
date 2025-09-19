let userModel = require('../../Model/userModel');

const getSpecificUserFromUserModel = async (req, res) => {
    try {  
        let id = req.params.id;
        let result = await userModel.findById(id);
        if(!result){
            return res.status(404).json({
                message: 'No data found', 
                status: 404, 
                data: {}, 
                success: false, 
                error: true
            });
        }
        res.json({
            message: 'User retrieved successfully', 
            status: 200, 
            data: result, 
            success: true, 

        })
    }
    catch (e) {
        res.json({
            message: 'Something went wrong', 
            status: 500, 
            data: e.message, 
            success: false, 
            error: true
        });
    }
}
    module.exports={  getSpecificUserFromUserModel}