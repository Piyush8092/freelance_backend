let influencerRoute=require('express').Router();
 const cookie = require('cookie-parser');
const authGuard = require('../middleware/auth');
 cookie();

const { UpdateSpecificInfluencer } = require('../controlers/influencer/influencerRegistration/UpdateSpecificInfluencer');
const { CreateInfluencerServices } = require('../controlers/influencer/influencerRegistration/createInfluencer');
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
 

//  create client request
influencerRoute.post('/create-influencer',authGuard,CreateInfluencerServices)
 influencerRoute.put('/update-influencer',authGuard,UpdateSpecificInfluencer);
influencerRoute.delete('/delete-influencer',authGuard,DeleteSpecificInfluencer);
influencerRoute.get('/get-influencer-query',queryInfluencers);
influencerRoute.get('/get-specific-influencer/:id',getSpecificInfulencer);
influencerRoute.get('/get-all-influencer',getAllInfluencer);


 
 
// influencer create post request
influencerRoute.post('/create-influencer-post',authGuard,createInfluencerPost);
influencerRoute.get('/get-specific-influencer-post/:id',getSpecificInfluencerPost);
influencerRoute.put('/update-influencer-post/:id',authGuard,updateInfluencerPost);
influencerRoute.delete('/delete-influencer-post/:id',authGuard,deleteInfluencerPost);
influencerRoute.get('get-all-post',getInfluencerPost);
influencerRoute.get('/get-post-creater-view',authGuard,getPostCreaterView);
influencerRoute.get('/query-influencer-post',getQueryPost);
 

// all influenecre detail
influencerRoute.get('/get-all-influencer',getAllInfluencer);
influencerRoute.get('/get-specific-influencer/:id',getSpecificInfulencer);

 

 module.exports=influencerRoute;