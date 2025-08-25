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
 router.get('/',(req,res)=>{
    res.send('Hello World');
});


// auth routr
router.post('/signup',SignupRout);
router.post('/login',LoginRout);
router.post('/change-password',ChangePassword);
router.post('/logout',LogoutRout);

// user detail
router.get('/get-user-detail',authGuard,getUserDetail);
router.put('/update-user/:id',authGuard,updateUser);
router.delete('/delete-user/:id',authGuard,deleteUser);


module.exports=router;