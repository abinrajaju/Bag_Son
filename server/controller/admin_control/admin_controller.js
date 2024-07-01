const jwt=require('jsonwebtoken')
const userdb=require('../../model/usermodel')
const productdb=require('../../model/product')
const offerdb=require('../../model/offermodel')
const categorydb = require('../../model/category')
const wishlistdb=require('../../model/wishlistmodel')
const cartdb=require('../../model/cartmodel')

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



//index
const applyoffer = async (product) => {
    if (!product) {
        return null;
    }

    try {
        const productOffer = await offerdb.findOne({
            product_name: product._id,
            status: 'active'
        });
       

        const categoryOffer = await offerdb.findOne({
            category_name: product.Category._id, // Ensure this matches the field used in product's schema
            status: 'active'
        });

        if (productOffer && typeof productOffer.discount_Percentage === 'number') {
            product.offerPrice = Math.round(product.price - (product.price * (productOffer.discount_Percentage / 100)));
            console.log("Applied product offer");
        } else if (categoryOffer && typeof categoryOffer.discount_Percentage === 'number') {
            product.offerPrice = Math.round(product.price - (product.price * (categoryOffer.discount_Percentage / 100)));
            console.log("Applied category offer");
        } else {
            product.offerPrice = product.price;
            console.log("No offers applied");
        }
    } catch (error) {
        console.error('Error applying offer:', error);
    }

    return product;
    
};





const index = async (req, res) => {
    try {



        let user = null;
        let cartCount = 0;
        let wishlist = null;
        const products = await productdb.find().populate('Category');
        const categoryId = req.query.id
        const Category = await categorydb.find();

        for (const product of products) {
            await applyoffer(product);
        }
          
       
        if (req.cookies.userToken) {
            user = await userdb.findOne({ email: req.session.email });
            const userId = user._id;

            const cart = await cartdb.findOne({ user: userId });
            cartCount = cart ? cart.items.length : 0;
            wishlist = await wishlistdb.findOne({ user: userId });
            if (user && user.status === "block") {
                res.redirect('/block')
        
              } else{

      
            res.render('user/index', { products, userToken: req.cookies.userToken, cartCount, user, wishlist, Category });
            }
        } else {
            res.render('user/index', { products, userToken: undefined, cartCount: 0, wishlist: 0, Category, categoryId });
        }



    } catch (error) {
        console.error('Error rendering index page:', error);
      res.redirect('/error500')
    }
};

module.exports={
    adminlogin,adminsign,admindash,adminlogout,err,block,index
 }




