const { assign } = require('nodemailer/lib/shared');
const cartdb=require('../../model/cartmodel')
const userdb =require('../../model/usermodel')




const get_cart=async(req,res)=>{


    try{
       const user=await userdb.findOne({email:req.session.email})
       
       const userid = user._id
       
       
      const usercart=await cartdb.findOne({user:userid}).populate('items.productId')
      
      let totalAmount = 0;
      let totalDiscount=0;
      let totalPrice=0
     
      if(!usercart){
        return res.render('user/cart',{user :null})

      } else {
        usercart.items.forEach(item => {
            const { productId, quantity } = item;   
            

             totalPrice = (productId.price * quantity);
            totalDiscount+=productId.discount;
            

            totalAmount += totalPrice;
            
        })
        let balance= totalAmount-totalDiscount
        usercart.totalAmount = totalAmount;
        
        usercart.totalDiscount = totalDiscount;
        usercart.balance=balance;
        await usercart.save()
    
    }
           
     
    res.render('user/cart', { user:usercart})

    }catch(err){
        console.log(err);
        res.redirect('/error500')
    }
   
}


const add_cart=async(req,res)=>{
    try {
        const productId = req.params.id;
       
        const user = await userdb.findOne({ email: req.session.email });


        let userCart = await cartdb.findOne({ user:user._id});
       

        if (!userCart) {
            userCart = new cartdb({
                user: user._id,
                items: [{ productId: productId, quantity: 1 }]
            });
        } else {
            const existingCartItemIndex = userCart.items.findIndex(item => item.productId.toString() === productId);
          

            if (existingCartItemIndex !== -1) {
               
               return res.redirect('/cart')
            } else {

                userCart.items.push({ productId: productId, quantity: 1 });
                
            }
        }


        await userCart.save();
        res.redirect('/cart');
    } catch (error) {
        console.log(error);
        res.redirect('/error500')
    }
}

const remove=async(req,res)=>{
    try {

        const productId = req.params.id;
        const user = await userdb.findOne({ email: req.session.email });

        if (!user) {
            return res.status(404).render('error500');
        }
        const userCart = await cartdb.findOne({ user: user._id });


        if (!userCart) {
            return res.status(404).render('error500');
        }

        const itemIndex = userCart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return  res.redirect('/error500')
        }


        userCart.items.splice(itemIndex, 1);


        await userCart.save();
        res.redirect('/cart')
    } catch (error) {
        console.error(error);

        
       
    }
}




module.exports={
    get_cart,add_cart,remove
}