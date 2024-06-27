const { render } = require('ejs')
const userdb= require('../../model/usermodel')
const addressdb=require('../../model/addressmodel')
const orderdb = require('../../model/odermodel')
const wishlistdb=require('../../model/wishlistmodel')
const cartdb=require('../../model/cartmodel')
const productdb= require('../../model/product')
const walletdb=require('../../model/walletmodel')
const { logout } = require('./user_Controller')
const wallet = require('../../model/walletmodel')



const profile=async(req,res)=>{
   try{
   
    const userToken= req.cookies.userToken
    const user= await userdb.findOne({email:req.session.email})
    const wallet= await walletdb.findOne({user:user})
    
    res.render('user/profile',{user,userToken,wallet})
   }catch(err){
    console.log(err);
    redirect('/err500')
}
}


const address=async(req,res)=>{
    
    
    try{
        const user= await userdb.findOne({email:req.session.email})
    const addresses= await addressdb.find({user:user._id})
   
    res.render('user/address',{user,addresses})
    }catch(err){
        console.log(err);
        redirect('/err500')
    }
}

const userorders= async(req,res)=>{
    try{

        const user= await userdb.findOne({email:req.session.email})
        const orders= await orderdb.find({userId:user._id})
        orders.reverse()
        res.render('user/oderdetail',{user,orders})
    }catch(err){
        console.log(err);
        redirect('/err500')
    }
}

const wishlisted=async(req,res)=>{
    try{
        const user = req.session.email;
        const userEmail = await userdb.findOne({ email: req.session.email });
        const userId = userEmail._id;
        const wishlist = await wishlistdb.findOne({ user: userId }).populate('items.productId');
            
       if(!wishlist){
       return res.render('user/wishlist',{wishlist:{items:[]},user,productInCart:""})
       }else{
            
       res.render('user/wishlist',{wishlist,user})
       }
    }catch(err){
        console.log(err);
       res.redirect('/err500')
    }
}


const add_wishlist=async(req,res)=>{
    try {
        const productId = req.params.id;
      
       
        const user = await userdb.findOne({ email: req.session.email });


        let userWish = await wishlistdb.findOne({ user:user._id});
       

        if (!userWish) {
            userWish = new wishlistdb({
                user: user._id,
                items: [{ productId: productId }]
            });
            
            await userWish.save();
        
        } else {
            if (userWish.items.some(items=>items.productId.toString()===productId.toString())){
                return  res.redirect('/wishlisted')
            }
           userWish.items.push({ productId: productId});
           await userWish.save() 
                
            //    res.redirect('/wishlisted')
             
            }
        
    }catch (error) {
        console.log(error);
        res.redirect('/error500')
    }
}


const remove_wishlist=async(req,res)=>{
    try {
        
        const productId = req.params.id;
        const userEmail = await userdb.findOne({ email: req.session.email });
        const user = userEmail._id;

        const userWish = await wishlistdb.findOne({ user: user });



        const itemIndex = userWish.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).render('error500');
        }

        userWish.items.splice(itemIndex, 1);

        await userWish.save();
        res.send('success');
    } catch (error) {
        console.error(error);
        res.status(500).send('error500');
    }

}



const get_address=async(req,res)=>{
    const user = await userdb.findOne({email:req.session.email})
  
    res.render('user/add_address',{user})
}

const add_address=async(req,res)=>{
    try{
        
        const email=req.session.email
        const user= await userdb.findOne({email:email})
       
        
      const address=new addressdb({
                user:user._id,
                name:req.body.name,
                email:req.body.email,
                mobileNumber:req.body.number,
                pincode:req.body.pincode,
                locality:req.body.locality,
                address:req.body.address,
                district:req.body.district,
                state:req.body.state,
                alternateMobile:req.body.phone,
                landmark:req.body.addressType
              })
        await address.save()
        res.redirect('/useraddress')
    }catch(err){
        console.log(err);
        res.redirect('error500')
    }
    }

const delete_address=async(req,res)=>{
    try {


        const id = req.params.id;

        addressdb.findByIdAndDelete(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: `Cannot delete address with ID: ${id}` });
                } else {
                    res.send({ message: "Address was deleted successfully" });
                }
            });

    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
}


const cancelOrder=async(req,res)=>{
    try {
        
    
        const orderId = req.params.orderId;
        const reason = req.query.reason || "No reason provided";
    
    
    
        const userEmail = req.session.email
        console.log(userEmail, "user");
        const user = await userdb.findOne({ email: userEmail })
        const userId = user._id;
        console.log('userId', userId);
    
        const wallet = await walletdb.findOne({ user: userId })
        const updateOrder = await orderdb.findByIdAndUpdate(orderId, {
          $set: { status: "Cancelled", cancellationReason: reason }
        }, { new: true }).populate("items.productId");
    
        if (!updateOrder) {
          return res.status(404).json({ success: false, message: "Order not found" });
        }
    
        let totalRefund = 0;
        let updatedWallet;
    
        for (const item of updateOrder.items) {
          await productdb.findByIdAndUpdate(item.productId, {
            $inc: { stock: item.quantity },
          });
    
          const refundAmount = item.price * item.quantity;
          totalRefund += refundAmount;
          if (!wallet) {
            const wallett = new walletdb({
              user: user,
              balance: refundAmount,
              transactions: { type: 'refund', amount: refundAmount, description: `Order Returned for item ${item.productname}` }
    
            })
            wallett.save()
          } else {
    
            updatedWallet = await walletdb.findOneAndUpdate(
              { user: userId },
              {
                $inc: { balance: refundAmount },
                $push: { transactions: { type: 'refund', amount: refundAmount, description: `Order cancelled for item ${item.productname}` } }
              },
              { upsert: true, new: true }
            );
          }
        }
    
        res.json({
          success: true,
          message: "Order cancelled successfully",
          refundAmount: totalRefund,
          newBalance: updatedWallet ? updatedWallet.balance : 0
        });
      } catch (error) {
        console.error("Error in getCancelOrder:", error);
        res.status(500).json({ success: false, message: "Error occurred during cancel order", error: error.message });
      }

}

const getwallet=async(req,res)=>{
    try{
        
        const user= await userdb.findOne({email:req.session.email})
        const wallet= await walletdb.findOne({user:user})
      
        res.render('user/wallethistory',{walletHistory:wallet,user})

    }catch(err){
        console.log(err);
    }
}





module.exports={
    profile,address,userorders,wishlisted,add_wishlist,remove_wishlist,get_address,add_address,delete_address,cancelOrder,getwallet
}