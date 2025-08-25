 let userModel = require('../../Model/userModel');

 const reach = async (req, res) => {
    try {
        let {reachNo} = req.body;
        let updateReachUserId=req.params.id;
        let authUserId=req.user._id;
        if(!authUserId){
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        let updateInfulencer=await userModel.findById(updateReachUserId);
        if(!updateInfulencer){
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if (!reachNo) {
            return res.status(400).json({ message: 'Reach is required' });
        }
        if (reachNo < 1 || reachNo > 1000000) {
            return res.status(400).json({ message: 'Reach must be between 1 and 1000000' });
        }
        updateInfulencer.reach.push({ userId: authUserId, reach: reachNo });
        await updateInfulencer.save();

        res.json({ message: 'Reach added successfully', status: 200, data: existingUser, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { reach };

