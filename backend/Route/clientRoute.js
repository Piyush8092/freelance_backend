let clientRoute=require('express').Router();
 const cookie = require('cookie-parser');
 const authGuard=require('../middleware/auth');
const { CreateClient } = require('../controlers/client/clientRegistration/createClient');
const { queryClients } = require('../controlers/client/clientRegistration/queryClient');
const { UpdateSpecificClient } = require('../controlers/client/clientRegistration/UpdateSpecificClient');
const { DeleteSpecificClient } = require('../controlers/client/clientRegistration/DeleteSpecificClient');
const { createJob } = require('../controlers/client/activity/createJobPost');
const { deleteJob } = require('../controlers/client/activity/deleteJobPost');
const { updateJob } = require('../controlers/client/activity/updateJobPost');
const { getAllJob } = require('../controlers/client/activity/getAllJobPost');
const { getSpecificJob } = require('../controlers/client/activity/getSpecificJob');
const { queryJobs } = require('../controlers/client/activity/getqueryJob');
const { getJobCreaterView } = require('../controlers/client/activity/ClientJobCreaterView');
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
const { JobApplyeracceptApplication } = require('../controlers/client/ApplyInfluencer/JobApplyeracceptApplication');
const { JobApplyerRejectApplication } = require('../controlers/client/ApplyInfluencer/JobApplyerRejectApplication');
const { getAcceptJobCreaterView } = require('../controlers/client/ApplyInfluencer/getAcceptJobCreaterView');
const { getRejectJobAppylerView } = require('../controlers/client/ApplyInfluencer/getRejectJobAppylerView');
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

// api is http://localhost:3000/api/job-creater-accept-application/68cd8de3e94f07ea727647ff/0.  body={"JobCreaterAccept": true}
 clientRoute.put('/job-creater-accept-application/:jobId/:index',authGuard,acceptApplication);
// api is http://localhost:3000/api/job-applyer-accept-application/68cd8de3e94f07ea727647ff.  body={"JobapplyerAccept": true}
 clientRoute.put('/job-applyer-accept-application/:jobId',authGuard,JobApplyeracceptApplication);
 
 // api is http://localhost:3000/api/job-creater-reject-application/68cd8de3e94f07ea727647ff/0.  body={"JobCreaterReject": true}
clientRoute.put('/job-creater-reject-application/:jobId/:index',authGuard,rejectApplication);
clientRoute.put('/job-Applyer-reject-application/:jobId',authGuard,JobApplyerRejectApplication);

 clientRoute.put('/bookmark-job/:id',authGuard,bookmarkJob);



 
                     //  display accept view 
// for client
clientRoute.get('/get-accept-applicant-jobApplyer-view',authGuard,getAcceptJobClientView);
//// for influencer 
clientRoute.get('/get-accept-applicant-jobcreater-view',authGuard,getAcceptJobCreaterView);


                      // display reject view
// for client
clientRoute.get('/get-reject-applicant-jobCreater-view',authGuard,getRejectJobJobCreaterView);
// for influencer
clientRoute.get('/get-reject-applicant-jobApplyer-view',authGuard,getRejectJobAppylerView);

                       // fix all get
clientRoute.get('/get-job-application-creater-view',authGuard,getAllJobApplication);
clientRoute.get('/get-all-job-application-admin-view',authGuard,getAllJobApplicationAdminView);




 module.exports=clientRoute;