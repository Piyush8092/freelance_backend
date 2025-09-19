 
let userModel = require('../../Model/userModel');

const changeUserRole = async (req, res) => {
    try {           
        let id = req.params.id;
        let payload = req.body;
        let newRole = payload.role;
        let ExistUser = await userModel.findById(id);
        if (!ExistUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Authorization: only ADMIN can change role
        let UserRole = req.user.role;
        if (UserRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        // Update user role in userModel
    let result=    await userModel.findByIdAndUpdate(id, { role: newRole }, { new: true });

       
        res.json({
            message: 'User role changed successfully', 
            status: 200, 
            data: result, 
            success: true, 
            error: false
        });

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
};

module.exports = { changeUserRole };


