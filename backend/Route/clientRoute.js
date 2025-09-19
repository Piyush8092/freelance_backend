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
const { applyJob } = require('../controlers/client/ApplyInfluencer/applyJobPost');
const { acceptApplication } = require('../controlers/client/ApplyInfluencer/acceptApplication');
const { rejectApplication } = require('../controlers/client/ApplyInfluencer/rejectApplication');
const { getAcceptJob } = require('../controlers/client/ApplyInfluencer/GetAcceptApplicant');
const { getAllClient } = require('../controlers/client/clientRegistration/getAllCilent');
const { getSpecificClient } = require('../controlers/client/clientRegistration/getSpecificClient');
const { getQueryClient } = require('../controlers/client/clientRegistration/getQueryCilent');
const { getAllJobApplication } = require('../controlers/client/ApplyInfluencer/GetAllJobApplicaion');
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
clientRoute.put('/apply-job/:id',authGuard,applyJob);
clientRoute.put('/accept-application/:id',authGuard,acceptApplication);
clientRoute.put('/reject-application/:id',authGuard,rejectApplication);
clientRoute.get('/get-accept-applicant',authGuard,getAcceptJob);
clientRoute.get('/get-reject-applicant',authGuard,rejectApplication);
clientRoute.get('/get-all-job-application',authGuard,getAllJobApplication);




 module.exports=clientRoute;