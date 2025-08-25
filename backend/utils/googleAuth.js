require('dotenv').config();
const passport = require('passport');
 const GoogleStrategy = require('passport-google-oauth20').Strategy;
 const userModel=require('../Model/userModel');
 
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLINT_ID,
    clientSecret: process.env.CILNT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/google/callback",
    passReqToCallback: true
  },
  async function (req, accessToken, refreshToken, profile, done) {
    try {
      // Check if user exists in DB
      let user = await userModel.findOne({ googleId: profile.id });
 if (!user) {
         user = await userModel.create({
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          googleId: profile.id,
          role:'GENERAL',
          date:new Date(),
          retailer:{}
         });
      }

      return done(null, user); // Pass user to next step (callback)
    } catch (err) {
      return done(err, null);
    }
  }
));
