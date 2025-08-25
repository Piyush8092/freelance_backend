const router=require('express').Router();
const authGuard=require('../middleware/auth');
const cookie = require('cookie-parser');
cookie();

const { ChangePassword } = require('../controlers/auth/changePassword');
const { LoginRout } = require('../controlers/auth/loginRout');
const { LogoutRout } = require('../controlers/auth/logoutRout');
const { SignupRout } = require('../controlers/auth/signupRout');
const { getUserDetail } = require('../controlers/user/getUserDetail');
const { updateUser } = require('../controlers/user/updateUser');
const { deleteUser } = require('../controlers/user/deleteUser');
const { ratting } = require('../controlers/UserActions/rattingUpdateRoute');
const { reach } = require('../controlers/UserActions/reachUpdateRoute');
const { review } = require('../controlers/UserActions/reviewUpdateRoute');
 router.get('/',(req,res)=>{
    res.send('Hello World');
});


// auth routr
router.post('/signup',SignupRout);
router.post('/login',LoginRout);
router.post('/change-password',ChangePassword);
router.post('/logout',LogoutRout);
router.put('/change-password/:id',authGuard,ChangePassword);

// user detail
router.get('/get-user-detail',authGuard,getUserDetail);
router.put('/update-user/:id',authGuard,updateUser);
router.delete('/delete-user/:id',authGuard,deleteUser);

// user action like review, ratting, reach
router.put('/ratting/:id',authGuard,ratting);
router.put('/reach/:id',authGuard,reach);
router.put('/review/:id',authGuard,review);





module.exports=router;