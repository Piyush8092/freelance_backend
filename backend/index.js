require('dotenv').config();
const express=require('express');
const app=express();
const router=require('./Route/route');
const connectDB=require('./DB/connection');
const port=process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const influencerRoute = require('./Route/influncerRoute');
const clientRoute = require('./Route/clientRoute');
 


 app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
  origin: "*", // allow all domains
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // allow all HTTP methods
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // allow common headers
}));


app.use('/api',router);
app.use('/api',influencerRoute);
app.use('/api',clientRoute);

 connectDB();
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});