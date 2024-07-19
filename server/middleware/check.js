const jwt=require('jsonwebtoken')
const userdb= require('../model/usermodel')



const adminCheck=async(req,res,next)=>{
    if(req.cookies.adminToken){
        next()
    }else{
        res.redirect('/adminsignup')
    }
}





const active=async(req,res,next)=>{
  try {
    if (req.session.email) {
        const user = await userdb.findOne({ email: req.session.email })
        if (user.status === 'blocked') {
            req.session.email = null;
            req.session= null;
            res.clearCookie('userToken');
            next()
        } else {
           next();
        }
    } else {
        req.session.email = null
        req.session= null;
        res.clearCookie('userToken');
        next();
    }
} catch (error) {
    console.log(error);
}
}




const checklog=async(req,res,next)=>{
  if (req.session.email){
    next()
  }else {
    res.redirect('/userlogin')
  }
}


module.exports={
    adminCheck,active,checklog
}