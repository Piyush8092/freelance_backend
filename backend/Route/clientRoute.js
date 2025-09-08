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
  cookie();

//  create client request
clientRoute.post('/create-client',authGuard,CreateClient)
clientRoute.get('/client-query',queryClients);
clientRoute.put('/update-client',authGuard,UpdateSpecificClient);
clientRoute.delete('/delete-client',authGuard,DeleteSpecificClient);
clientRoute.get('/get-all-client',getAllClient);
clientRoute.get('/get-specific-client/:id',getSpecificClient);
clientRoute.get('/get-client-query',getQueryClient);





// create job request
clientRoute.post('/create-job',authGuard,createJob);
clientRoute.delete('/delete-job',authGuard,deleteJob);
clientRoute.put('/update-job',authGuard,updateJob);
clientRoute.get('/get-all-job',getAllJob);
clientRoute.get('/get-specific-job',getSpecificJob);
clientRoute.delete('/get-query-job',queryJobs);
clientRoute.get('/job-creater-view',authGuard,getJobCreaterView);
 


// apply job request
clientRoute.post('/apply-job/:id',authGuard,applyJob);
clientRoute.put('/accept-application/:id',authGuard,acceptApplication);
clientRoute.put('/reject-application/:id',authGuard,rejectApplication);
clientRoute.get('/get-accept-applicant',authGuard,getAcceptJob);
clientRoute.get('/get-reject-applicant',authGuard,rejectApplication);



 module.exports=clientRoute;