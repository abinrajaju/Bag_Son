const { render } = require("ejs")
const userdb = require("../../model/usermodel")
const productdb = require('../../model/product')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const cartdb=require('../../model/cartmodel')
const wishlistdb=require('../../model/wishlistmodel')





const createTransporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'abinraj1090@gmail.com',
    pass: 'qent njzg hrfu njtm',
  },
});



const get_login = async (req, res) => {
  try {
    if (req.cookies.userToken) {
        res.redirect('/')
    }else{
      res.render('user/user_login',{message:""})
    }
  } catch (err) {
    console.log(err);
    res.redirect('/err500')
  }

}

const get_sign = async (req, res) => {
  try {
    if (req.cookies.userToken) {
        res.redirect('/')
    }else{
      res.render('user/user_signup', { message: "" })
    }
  } catch (err) {
    console.log(err);
    res.redirect('/err500')
  }

 
}


const post_login = async (req, res) => {

  try {

    const { email, password } = req.body
    const user = await userdb.findOne({ email: email })

    if (!user) {
      return res.render('user/user_login', { message: 'incorrect email' })
    }
    if (user.password !== password) {

      return res.render('user/user_login', { message: 'incorrect password' })
    }

    if (user.status == 'blocked') {

      return res.render('user/user_login', { message: "User is blocked" })
    }
    if (user) {


      const userToken = jwt.sign(
        { email: req.body.email }, 'your_key', { expiresIn: '1h' }
      );
      req.session.email = req.body.email;
      res.cookie('userToken', userToken);
      res.redirect('/')
    } else {
      res.render('user/user_login', { message: "Email doesn't exists" })

    }
  } catch (error) {
    console.log(error)
    res.redirect("/error500")

  }
}



const index = async (req, res) => {
  try {
    if (req.cookies.userToken) {

      const user = await userdb.findOne({ email: req.session.email })
    
      const wishlist= await wishlistdb.findOne({user:user._id})
        

      const products = await productdb.find().populate("Category")
      if (user && user.status === "block") {
        res.redirect('/block')

      } else {
        res.render('user/index', { products, userToken: req.cookies.userToken, wishlist: wishlist})
      }


    } else {
      const products = await productdb.find().populate('Category')
      res.render('user/index', { products, userToken: undefined, wishlist:null })
    }
  } catch (err) {
    console.log(err);
    res.redirect('/err500')
  }

}




const signup = async (req, res) => {

  if (req.cookies.userToken) {
    res.redirect('/')
  } else if (req.session.otp) {
    delete req.session.otp;
    res.render('user/user_signup', { message: "", })
  }

  const existuser = await userdb.findOne({ email: req.body.email })
  req.session.Nname = req.body.name;
  req.session.Eemail = req.body.email;
  req.session.Ppass = req.body.pass;
  if (existuser) {
    res.render('user/user_signup', { message: 'email already exist', })
  } else {

    const recipientEmail = req.body.email

    const otp = generateOTP();
    console.log(otp);

    req.session.otp = otp
  


    createTransporter.sendMail({
      from: 'abinraj1090@gmail.com',
      to: recipientEmail,
      subject: 'your OTP verification',
      text: `your OTP is ${otp}`
    }, (err, info) => {
      console.log("hi");                                                            
      if (err) {
        console.log('Error sending email', err);
        res.render('user/user_signup', { message: 'Error sending OTP via email' })
      } else {
        console.log("keriyo");


        console.log('OTP sent Succesfully', info.response);
        res.render('user/otp', { email: req.body.email, message: "", error: '' });

      }
    })



  }
}
const resend = async (req, res) => {

  

    const recipientEmail = req.body.email||req.session.Eemail
    

    const otp = generateOTP();
   

    req.session.otp = otp
  


    createTransporter.sendMail({
      from: 'abinraj1090@gmail.com',
      to: recipientEmail,
      subject: 'your OTP verification',
      text: `your OTP is ${otp}`
    }, (err, info) => {
                                                                 
      if (err) {
        console.log('Error sending email', err);
        res.render('user/user_signup', { message: 'Error sending OTP via email' })
      } else {
       

        console.log(otp);
        console.log('OTP sent Succesfully', info.response);
        res.render('user/otp', { email: req.body.email, message: "", error: '' });

      }
    })



  }





function generateOTP() {
  const length = 5;  //set the desired length of the otp
  const digits = '0123456789';//only digits(0-9)

  let otp = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits.charAt(randomIndex)
  }
  return otp
}


// const otp = async (req, res) => {
//   res.render('otp')
// }



const verify = async (req, res) => {
  if (req.session.otp == req.body.otp) {
    req.session.email = req.session.Eemail
    console.log(req.session.Ppass);
    const user = new userdb({
      name: req.session.Nname,
      email: req.session.Eemail,
      password: req.session.Ppass,

    })
    delete req.session.otp; 
    await user.save();
    const userToken = jwt.sign(
      { email: req.session.Eemail }, 'your_key', { expiresIn: '1h' }
    );
    res.cookie('userToken', userToken);
    res.redirect('/')
  } else {
    res.status(400).render('user/otp', { message: 'OTP is not matching', error: '' });
  }
}


const logout = async (req, res) => {
  req.session.email = null
  res.clearCookie('userToken');
  res.redirect('/')

}



const block = async (req, res) => {
  res.render('user/block')
}


const productDetail = async (req, res) => {


  const products = await productdb.find()
  const product = await productdb.findById(req.query.id)


  res.render('user/productDetail', { product, products })

}





const forgot=async(req,res)=>{
  res.render('user/forgot')
}


const post_forgot=async(req,res)=>{
  try{
    const email=req.body.email
  const user= await userdb.findOne({email:email})

  if(!user){
    res.render('user/user_login',{message:'email not exist'})
  }

  const recipientEmail = req.body.email
      req.session.forgotemail =  req.body.email;
      const otp = generateOTP();
   

    req.session.forgot = otp
  


    createTransporter.sendMail({
      from: 'abinraj1090@gmail.com',
      to: recipientEmail,
      subject: 'your OTP verification',
      text: `your OTP is ${otp}`
    }, (err, info) => {
                                                                 
      if (err) {
        console.log('Error sending email', err);
        res.render('user/user_login', { message: 'Error sending OTP via email' })
      } else {
       

        console.log(otp);
        console.log('OTP sent Succesfully', info.response);
        res.render('user/forgototp', { email: req.body.email, message: "", error: '' });

      }
    })

  }catch(err){
    console.log(err);
    redirect('/err500')
  }


}



const forgot_verify=async(req,res)=>{
  if (req.session.forgot == req.body.otp) {
       res.render('user/reset_password')
      
  } else {
    res.render('user/forgototp', { message: 'OTP is not matching', error: '' });
  }
}

const reset_password=async(req,res)=>{
 try{
  const password=req.body.password
  const user = await userdb.findOne({ email: req.session.forgotemail});
  user.password=password
  await user.save();
  res.redirect('/userlogin')
 }catch(err){
  console.log(err);
  res.redirect('/err500')
 }
}





const forgot_resent=async(req,res)=>{
  try{
   
  

  

  const recipientEmail = req.session.forgotemail 
   
      const otp = generateOTP();
   

    req.session.forgot = otp
  


    createTransporter.sendMail({
      from: 'abinraj1090@gmail.com',
      to: recipientEmail,
      subject: 'your OTP verification',
      text: `your OTP is ${otp}`
    }, (err, info) => {
                                                                 
      if (err) {
        console.log('Error sending email', err);
        res.render('user/user_login', { message: 'Error sending OTP via email' })
      } else {
       

        console.log(otp);
        console.log('OTP sent Succesfully', info.response);
        res.render('user/forgototp', { email: req.body.email, message: "", error: '' });

      }
    })

  }catch(err){
    console.log(err);
    redirect('/err500')
  }


}



module.exports = {
  index, get_login, get_sign, productDetail, signup, verify, post_login, logout, block,resend,forgot,post_forgot,forgot_verify,
  reset_password,forgot_resent
}