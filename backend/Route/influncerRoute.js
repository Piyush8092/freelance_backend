let influencerRoute=require('express').Router();
 const cookie = require('cookie-parser');
const authGuard = require('../middleware/auth');
 cookie();

const { UpdateSpecificInfluencer } = require('../controlers/influencer/influencerRegistration/UpdateSpecificInfluencer');
 const { CreateInfluencer } = require('../controlers/influencer/influencerRegistration/createInfluencer');
const { queryInfluencers } = require('../controlers/influencer/influencerRegistration/queryInfluencer');
const { DeleteSpecificInfluencer } = require('../controlers/influencer/influencerRegistration/DeleteSpecificInfluencer');
const { createInfluencerPost } = require('../controlers/influencer/Allpost/createInfluencerPost');
const { getSpecificInfluencerPost } = require('../controlers/influencer/Allpost/getSpecificInfluencerPost');
const { updateInfluencerPost } = require('../controlers/influencer/Allpost/updateInfluencerPost');
const { deleteInfluencerPost } = require('../controlers/influencer/Allpost/deleteInfluencerPost');
const { getPostCreaterView } = require('../controlers/influencer/Allpost/PostCreaterView');
const { getQueryPost } = require('../controlers/influencer/Allpost/getQueryPost');
const { getInfluencerPost } = require('../controlers/influencer/Allpost/getInfluencerPost');
const { getAllInfluencer } = require('../controlers/influencer/influencerRegistration/getAllInfluencer');
const { getSpecificInfulencer } = require('../controlers/influencer/influencerRegistration/getSpecificInfulencer');
 const { addCommentInfluencerPost } = require('../controlers/influencer/Allpost/addCommentInfluencerPost');
const { deleteCommentInfluencerPost } = require('../controlers/influencer/Allpost/deleteCommentInfluencerPost');
const { updateLikeInfluencerPost } = require('../controlers/influencer/Allpost/updateLikeInfluencerPost');
const { updateDislikeInfluencerPost } = require('../controlers/influencer/Allpost/updateDislikeInfluencerPost');
const { updateFollowers } = require('../controlers/influencer/influencerRegistration/updateFollowers');
const { updateFolloweing } = require('../controlers/influencer/influencerRegistration/updateFolloweing');
const { getAllFollower } = require('../controlers/influencer/influencerRegistration/getAllFollower');
const { getAllFolloweing } = require('../controlers/influencer/influencerRegistration/getAllFolloweing');

//  create client request
influencerRoute.post('/create-influencer',authGuard,CreateInfluencer)
 influencerRoute.put('/update-influencer/:id',authGuard,UpdateSpecificInfluencer);
influencerRoute.delete('/delete-influencer/:id',authGuard,DeleteSpecificInfluencer);
influencerRoute.get('/get-influencer-query',queryInfluencers);
influencerRoute.get('/get-specific-influencer/:id',getSpecificInfulencer);
influencerRoute.get('/get-all-influencer',getAllInfluencer);
// // update followers
influencerRoute.put('/update-followers/:id',authGuard,updateFollowers);
influencerRoute.put('/update-following/:id',authGuard,updateFolloweing);
influencerRoute.get('/get-all-follower/:id',authGuard,getAllFollower);
influencerRoute.get('/get-all-following/:id',authGuard,getAllFolloweing);

     


 
 
 
// influencer create post request
influencerRoute.post('/create-influencer-post',authGuard,createInfluencerPost);
influencerRoute.get('/get-specific-influencer-post/:id',getSpecificInfluencerPost);
influencerRoute.put('/update-influencer-post/:id',authGuard,updateInfluencerPost);
influencerRoute.delete('/delete-influencer-post/:id',authGuard,deleteInfluencerPost);
influencerRoute.get('/get-all-post',getInfluencerPost);
influencerRoute.get('/get-post-creater-view',authGuard,getPostCreaterView);
// api is => http://localhost:3000/api/query-influencer-post?query=electronic
influencerRoute.get('/query-influencer-post',getQueryPost);

// Like/Dislike influencer posts. 
influencerRoute.put('/like-influencer-post/:id', authGuard, updateLikeInfluencerPost); // send like=true
influencerRoute.put('/dislike-influencer-post/:id', authGuard, updateDislikeInfluencerPost); //send dislike=true

// Comment routes for influencer posts
influencerRoute.put('/comment-influencer-post/:id', authGuard, addCommentInfluencerPost);
influencerRoute.delete('/delete-comment-influencer-post/:id/:commentId', authGuard, deleteCommentInfluencerPost);

// all influenecre detail
influencerRoute.get('/get-all-influencer',getAllInfluencer);
influencerRoute.get('/get-specific-influencer/:id',getSpecificInfulencer);

 

 module.exports=influencerRoute;
