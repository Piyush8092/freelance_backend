let userModel = require('../../Model/userModel');

const ratting = async (req, res) => {
    try {
        let {rattingNo} = req.body;
        let updateRattingUserId=req.params.id;
        let authUserId=req.user._id;
        if(!authUserId){
            return res.status(400).json({ message: 'Invalid credentials' });
        }
let updateInfulencer=await userModel.findById(updateRattingUserId);
if(!updateInfulencer){
    return res.status(400).json({ message: 'Invalid credentials' });
}
 
        if (!rattingNo) {
            return res.status(400).json({ message: 'Ratting is required' });
        }
        if (rattingNo < 1 || rattingNo > 5) {
            return res.status(400).json({ message: 'Ratting must be between 1 and 5' });
        }
       
        updateInfulencer.ratting.push({ userId: authUserId, ratting: rattingNo });
        await updateInfulencer.save();

        res.json({ message: 'Ratting added successfully', status: 200, data: existingUser, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { ratting };

