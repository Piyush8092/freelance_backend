let userModel = require('../../Model/userModel');

const review = async (req, res) => {
        try {
            let payload= req.body;
            let review=payload.review;
            let updateReviewUserId=req.params.id;
            let authUserId=req.user._id;
            if(!authUserId){
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            let updateInfulencer=await userModel.findById(updateReviewUserId);
            if(!updateInfulencer){
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            if (!review) {
                return res.status(400).json({ message: 'Review is required' });
            }
          
            updateInfulencer.review.push({ userId: authUserId, review: review ,image:payload.image});
            await updateInfulencer.save();
    
            res.json({ message: 'Review added successfully', status: 200, data: existingUser, success: true, error: false });
        }
        catch (e) {
            res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
        }
    };

module.exports = { review };


