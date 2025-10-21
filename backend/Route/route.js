const router=require('express').Router();
const authGuard=require('../middleware/auth');
const cookie = require('cookie-parser');
cookie();

const { ChangePassword } = require('../controlers/auth/changePassword');
const { LoginRout } = require('../controlers/auth/loginRout');
const { LogoutRout } = require('../controlers/auth/logoutRout');
const { SignupRout } = require('../controlers/auth/signupRout');
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
const { createPrivacyPolicy } = require('../controlers/privacy/privacyCreate');
const { getPrivacyPolicy } = require('../controlers/privacy/privacyGet');
const { editPrivacyPolicy } = require('../controlers/privacy/privecyEdit');
const { deletePrivacyPolicy } = require('../controlers/privacy/privecyDelete');
const { getSpecificPrivacyPolicy } = require('../controlers/privacy/getSpecificPrivecy');
const { createTermsAndConditions } = require('../controlers/term/termCreate');
const { getTermsAndConditions } = require('../controlers/term/termGet');
const { editTermsAndConditions } = require('../controlers/term/termEdit');
const { deleteTermsAndConditions } = require('../controlers/term/termDelete');
const { getSpecificTermsAndConditions } = require('../controlers/term/getSpecificTerm');
const { getClientUserDetail } = require('../controlers/user/getAllClientDetail');
 const { changeUserRole } = require('../controlers/user/changeUserRole');
const { getAllUserFromUserModel } = require('../controlers/user/getAllUserFromUserModel');
const { getSpecificUserFromUserModel } = require('../controlers/user/getSpecificUserFromUserModel');
const { getInfluencerUserDetail } = require('../controlers/user/getInfluencerUserDetail');
const { getQueryUserFromUserModel } = require('../controlers/user/getQueryUserFromUserModel');
const { getCampaignCreaterView } = require('../controlers/campaign/CampaignCreaterView');
const { createContact } = require('../controlers/contact/createContact');
const { getContact } = require('../controlers/contact/getContactData');
const { getSpecificContact } = require('../controlers/contact/getSpecificContact');
const { deleteContact } = require('../controlers/contact/DeleteContact');
const { updateContact } = require('../controlers/contact/updateContact');
const { queryContact } = require('../controlers/contact/queryContact');
 

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
  passport.authenticate('google', { session: false, failureRedirect: 'https://freelance-backend-v51r.onrender.com/login' }),
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
    res.redirect('https://freelance-backend-v51r.onrender.com/home');
  }
);

// for frontend call
// for gooogle sign up
// let handelGoogleSignup=()=>{
//       window.location.href = 'http://localhost:8000/auth/google';
      
// }



// user detail
router.get('/get-client-user-detail',authGuard,getClientUserDetail);
router.get('/get-influencer-user-detail',authGuard,getInfluencerUserDetail);
 router.get('/get-specific-service-user-detail',authGuard,getSpecificUserDetail);

// for admin access and role change
router.put('/change-role-usermodel/:id',authGuard,changeUserRole);
router.get('/all-user-usermodel',authGuard,getAllUserFromUserModel);
router.get('/get-specific-user-usermodel/:id',authGuard,getSpecificUserFromUserModel);
// api is => http://localhost:3000/api/get-query-user-usermodel?query=ADMIN
router.get('/get-query-user-usermodel',authGuard,getQueryUserFromUserModel);







// user action campaign
router.post('/create-campaign',authGuard,createCampaign);
router.get('/get-all-campaign',getAllCampaigns);
router.get('/get-specific-campaign/:id',getSpecificCampaign);
//query api is => http://localhost:3000/api/get-query-campaign?query=kolkata
router.get('/get-query-campaign',queryCampaigns);
router.put('/update-campaign/:id',authGuard,updateCampaign);
router.delete('/delete-campaign/:id',authGuard,deleteCampaign);
router.get('/get-campaign-creater-view',authGuard,getCampaignCreaterView);




 
 // privacy policy
router.post('/create-privacy-policy',authGuard,createPrivacyPolicy);
router.get('/get-privacy-policy',getPrivacyPolicy);
router.put('/edit-privacy-policy/:id',authGuard,editPrivacyPolicy);
router.delete('/delete-privacy-policy/:id',authGuard,deletePrivacyPolicy);
router.get('/get-specific-privacy-policy/:id',getSpecificPrivacyPolicy);


// terms and conditions
router.post('/create-terms-and-conditions',authGuard,createTermsAndConditions);
router.get('/get-terms-and-conditions',getTermsAndConditions);
router.put('/edit-terms-and-conditions/:id',authGuard,editTermsAndConditions);
router.delete('/delete-terms-and-conditions/:id',authGuard,deleteTermsAndConditions);
router.get('/get-specific-terms-and-conditions/:id',getSpecificTermsAndConditions);

//contact us
router.post('/create-contact',authGuard,createContact);
router.get('/get-contact',getContact);
router.put('/update-contact/:id',authGuard,updateContact);
router.delete('/delete-contact/:id',authGuard,deleteContact);
router.get('/get-specific-contact/:id',getSpecificContact);
router.get('/get-query-contact',queryContact);



module.exports=router;