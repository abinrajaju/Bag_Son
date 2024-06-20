const jwt=require('jsonwebtoken')
const userdb=require('../../model/usermodel')



const err=async(req,res)=>{
  res.render('admin/err500')
}






//admin login 
const adminlogin=async(req,res)=>{
    if(req.cookies.adminToken){
        res.redirect('/admin')
    }else{
      
            res.render('admin/admin_login')
        }
    }
           

const adminsign=async(req,res)=>{
        try{
            const credential={
                email:"admin@gmail.com",
                password:"123"
            };
            console.log(req.body);
            if(req.body.email==credential.email&&req.body.password==credential.password){
                const adminToken=jwt.sign(
                    {email:credential.email},
                    'your_key',
                    {expiresIn:'1h'},
                  
                ); 
                
                res.cookie('adminToken',adminToken)
                console.log(req.cookies.adminToken);
                res.redirect('/admin')
            }else{
                res.redirect('/adminsignup?pass=wrong')
            }
        }catch(err){
            console.log(err);
            res.redirect('/?error=login_failed')
        }
    }

const admindash = async (req, res) => {
    if(req.cookies.adminToken){
        res.render('admin/dashbo')
    }else{
        res.redirect("/adminsignup")
    }
    
 }



const adminlogout=async(req,res)=>{
   res.clearCookie('adminToken')
   res.redirect('/adminsignup')
 }




 const block = async (req, res) => {
    try {
        const blockId = req.query.id;
        const user = await userdb.findById(blockId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        user.status = user.status === 'active' ? 'blocked' : 'active';
        await user.save();
        res.redirect('/userdetail');
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send("Internal Server Error");
    }
}




module.exports={
    adminlogin,adminsign,admindash,adminlogout,err,block
 }




