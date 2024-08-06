const passport=require('passport')
const GoogleStrategy=require('passport-google-oauth20')
const userModel=require('../model/usermodel')
const jwt=require('jsonwebtoken')
const secretKey = 'your_key';
const dotenv = require('dotenv')

dotenv.config({ path: 'config.env' })

const client_secret=process.env.GOOGLE_secret

const client_ID= process.env.GOOGLE_client



passport.use(new GoogleStrategy({
    clientID: client_ID,
    clientSecret:client_secret,
    callbackURL: 'https://bagsons.shop/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await userModel.findOne({ email: profile.emails[0].value });
      
      if (!user) {
        user = new userModel({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: 'defaultPassword'
        });
        await user.save();
      }
      const userToken = jwt.sign({ email: user.email},secretKey, { expiresIn: '1h' });
      
  
      done(null, { user, userToken });
    } catch (error) {
      done(error, null);
    }
  }));
  
  
  passport.serializeUser((user, done) => {
 
    const sessionUser = {
        id: user.user._id, 
        name: user.user.name,
        email: user.user.email 
      };
      
    
    done(null, sessionUser);
  });
  
  passport.deserializeUser(async (sessionUser, done) => {
    try {
      const user = await userModel.findById(sessionUser.id);
      done(null, user);
    } catch (error) {
      done(error, null);
      }
    });