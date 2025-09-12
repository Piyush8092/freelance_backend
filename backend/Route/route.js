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
const { getSpecificUserDetail } = require('../controlers/user/getSpecificUserDetail');
const passport = require('passport');
const { createCampaign } = require('../controlers/campaign/createCampaign');
const { getAllCampaigns } = require('../controlers/campaign/getAllCampaign');
const { getSpecificCampaign } = require('../controlers/campaign/getSpecificCampaign');
const { queryCampaigns } = require('../controlers/campaign/getQueryCampaign');
const { updateCampaign } = require('../controlers/campaign/updateCampaign');
const { deleteCampaign } = require('../controlers/campaign/deleteCampaign');

router.use(passport.initialize());

 router.get('/',(req,res)=>{
    res.send('Hello World');
});


// auth routr
router.post('/signup',SignupRout);
router.post('/login',LoginRout);
router.post('/change-password',ChangePassword);
router.get('/logout',LogoutRout);
router.put('/change-password/:id',authGuard,ChangePassword);

// for google signup/login
 // for jwt tokon integression with google auth20
router.get('/auth/google',
  passport.authenticate('google', { scope: ['email','profile'] }));

// this req send frontend rouet => this route call from utiles/googleAuth.js automatic
 
router.get('/auth/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
          const user = req.user;

    // JWT creation
    const token = jwt.sign({ _id: user._id, email: user.email },process.env.SECRET_KEY || '3y2yxhx829299292hc2rhh9h2rhcj9j2rj9r9rj92', { expiresIn: '30d' });

    // Set the JWT in a secure cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false, // set to true in production (HTTPS)
      sameSite: 'Lax',
    });

    // // Redirect to frontend
    res.redirect('http://localhost:3000/home');
  }
);

// for frontend call
// for gooogle sign up
// let handelGoogleSignup=()=>{
//       window.location.href = 'http://localhost:8000/auth/google';
      
// }



// user detail
router.get('/get-user-detail',authGuard,getUserDetail);
router.put('/update-user/:id',authGuard,updateUser);
router.delete('/delete-user/:id',authGuard,deleteUser);
router.get('/get-specific-user-detail/:id',authGuard,getSpecificUserDetail);

// user action campaign
router.post('/create-campaign',authGuard,createCampaign);
router.get('/get-all-campaign',getAllCampaigns);
router.get('/get-specific-campaign/:id',getSpecificCampaign);
//query api is => http://localhost:3000/api/get-query-campaign?query=kolkata
router.get('/get-query-campaign',queryCampaigns);
router.put('/update-campaign/:id',authGuard,updateCampaign);
router.delete('/delete-campaign/:id',authGuard,deleteCampaign);



// colaboration apis

 





module.exports=router;