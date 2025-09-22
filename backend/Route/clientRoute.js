let clientRoute=require('express').Router();
 const cookie = require('cookie-parser');
 const authGuard=require('../middleware/auth');
const { CreateClient } = require('../controlers/client/clientRegistration/createClient');
const { queryClients } = require('../controlers/client/clientRegistration/queryClient');
const { UpdateSpecificClient } = require('../controlers/client/clientRegistration/UpdateSpecificClient');
const { DeleteSpecificClient } = require('../controlers/client/clientRegistration/DeleteSpecificClient');
const { createJob } = require('../controlers/client/activity/createPost');
const { deleteJob } = require('../controlers/client/activity/deletePost');
const { updateJob } = require('../controlers/client/activity/updatePost');
const { getAllJob } = require('../controlers/client/activity/getAllPost');
const { getSpecificJob } = require('../controlers/client/activity/getSpecificJob');
const { queryJobs } = require('../controlers/client/activity/getqueryJob');
const { getJobCreaterView } = require('../controlers/client/activity/ClientCreaterView');
 const { acceptApplication } = require('../controlers/client/ApplyInfluencer/acceptApplication');
const { rejectApplication } = require('../controlers/client/ApplyInfluencer/rejectApplication');
const {   getAcceptJobClientView } = require('../controlers/client/ApplyInfluencer/GetAcceptApplicantJobCreaterView');
const {  getRejectJobJobCreaterView } = require('../controlers/client/ApplyInfluencer/GetRejectApplicantJobCreaterView');
const { bookmarkJob } = require('../controlers/client/ApplyInfluencer/bookmarkJob');
 const { getAllClient } = require('../controlers/client/clientRegistration/getAllCilent');
const { getSpecificClient } = require('../controlers/client/clientRegistration/getSpecificClient');
const { getQueryClient } = require('../controlers/client/clientRegistration/getQueryCilent');
const { getAllJobApplication } = require('../controlers/client/ApplyInfluencer/GetAllJobApplicaion');
const { getAllJobApplicationAdminView } = require('../controlers/client/ApplyInfluencer/GetAllJobApplicationAdminView');
  cookie();

//  create client request
clientRoute.post('/create-client',authGuard,CreateClient);
 clientRoute.put('/update-client/:id',authGuard,UpdateSpecificClient);
clientRoute.delete('/delete-client/:id',authGuard,DeleteSpecificClient);
clientRoute.get('/get-all-client',getAllClient);
clientRoute.get('/get-specific-client/:id',getSpecificClient);
// api is => http://localhost:3000/api/get-client-query?query=electronic
clientRoute.get('/get-client-query',getQueryClient);
// same but with out populate
clientRoute.get('/client-query',queryClients);






// create job request
clientRoute.post('/create-job',authGuard,createJob);
clientRoute.delete('/delete-job/:id',authGuard,deleteJob);
clientRoute.put('/update-job/:id',authGuard,updateJob);
clientRoute.get('/get-all-job',getAllJob);
clientRoute.get('/get-specific-job/:id',getSpecificJob);
clientRoute.get('/get-query-job',queryJobs);
clientRoute.get('/job-creater-view',authGuard,getJobCreaterView);
 


// apply job request
 clientRoute.put('/accept-application/:id',authGuard,acceptApplication);
clientRoute.put('/reject-application/:id',authGuard,rejectApplication);
 clientRoute.put('/bookmark-job/:id',authGuard,bookmarkJob);
clientRoute.get('/get-accept-applicant-jobCreater-view',authGuard,getAcceptJobClientView);
clientRoute.get('/get-reject-applicant-jobCreater-view',authGuard,getRejectJobJobCreaterView);
clientRoute.get('/get-job-application-creater-view',authGuard,getAllJobApplication);
clientRoute.get('/get-all-job-application-admin-view',authGuard,getAllJobApplicationAdminView);



 module.exports=clientRoute;