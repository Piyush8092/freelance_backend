const user = require('../../Model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../Model/userModel');

const ChangePassword = async (req, res) => {
    try {
        let payload = req.body;
        let userId=req.params.id;
        let authUserId=req.user._id;
        if(!authUserId){
            return res.status(400).json({ message: 'Invalid credentials' });
        }
    if(userId!=authUserId){
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if(payload.password!=payload.confirmPassword) {
            return res.status(400).json({ message: 'Password  invalid credentials' });
        }
        if (!payload.email && !payload.phone) {
            return res.status(400).json({ message: 'Email or phone is required' });
        }

        let existingUser = null;
        if(payload.email){
            existingUser = await user.findOne({ email: payload.email });
            if (!existingUser) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
        }
        if(payload.phone && !existingUser){
            existingUser = await user.findOne({ phone: payload.phone });
            if (!existingUser) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
        }
        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
if(authUserId!=existingUser._id){
    return res.status(400).json({ message: 'Invalid credentials' });
}

 existingUser.password=await bcrypt.hash(payload.password,10);
 let updatedUser=await User.findByIdAndUpdate(existingUser._id,existingUser,{new:true});
 res.json({ message: 'Password changed successfully', status: 200, data: updatedUser, success: true, error: false });
    } 
    catch (e) {
        res.json({message: 'Something went wrong', status: 500, data: e, success: false, error: true});
    }
};

module.exports = { ChangePassword };

