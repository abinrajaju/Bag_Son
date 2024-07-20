const addressdb=require('../../model/addressmodel')
const userdb=require('../../model/usermodel')
const productdb=require('../../model/product')
const cartdb=require('../../model/cartmodel')
const orderdb=require('../../model/odermodel')
const coupondb=require('../../model/copunmodel')
const Razorpay=require('razorpay')
const walletdb=require('../../model/walletmodel')
const dotenv = require('dotenv')
dotenv.config({ path: 'config.env' })

var razorpay = new Razorpay({
    key_id: process.env.razorpayKey,
    key_secret: process.env.razorpaysecret,
  });


   


const get_checkout= async(req,res)=>{

    
    const user=await userdb.findOne({email:req.session.email})
    const products=await cartdb.findOne({user:user._id}).populate('items.productId')
    const applicableCoupons= await coupondb.find()
    const address=await addressdb.find({user:user._id})
    const wallet=await walletdb.findOne({user:user._id})
    console.log(wallet);
   
    res.render('user/checkout',{address,products,applicableCoupons,wallet})
}


const cod=async(req,res)=>{
    try {
       
        const { data, paymentMethod,totalamount} = req.body;
        const { items, addressId } = data;
        console.log(totalamount);
        
          
        const address = await addressdb.findById(addressId);
        
        if (!address) {
            return res.status(401).json({ message: 'Address not found', status: 401 });
        }


        const User = await userdb.findOne({ email: req.session.email });
        if (!User) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userId = User._id;

       

        const updatedProducts = [];
        for (const item of items) {
            const productId = item.productId;
       

            const product = await productdb.findById(productId);
            
            if (!product) {
                console.log(`Product with ID ${productId} not found`);
                continue;
            }
             
            if (product.stock < item.quantity) {
               
                return res.status(400).json({ message: `Product with ID ${productId} is out of stock` });
            }

            product.stock -= item.quantity;
            product.count += 1;
            await product.save();
            

            updatedProducts.push({
                productId: productId,
                price: product.price,
                quantity: item.quantity,
            });
        }
       

           
        const order = new orderdb({
            userId: userId,
            items: updatedProducts,
            totalAmount: totalamount,
            address: address,
            paymentMethod: paymentMethod,
            paymentStatus: "Pending",
            status: 'Pending'
        });

        await order.save();
           
        await cartdb.findOneAndDelete({ user: userId });
        res.json({message:"order completed"})



    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const check_stock=async(req,res)=>{
    try {
       
        const allItems = req.body.allItems;
        
       

        const outOfStockItems = [];


        for (const item of allItems) {

            const productId = item.productId;



            const product = await productdb.findById(productId);


            if (!product) {

                console.log(`Product with ID ${productId} not found`);
                continue;
            }
              
            if (product.stock < item.quantity) {

                outOfStockItems.push(productId);
            }
        }
        


        res.status(200).json({ outOfStockItems });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const placed=async(req,res)=>{
    try {
      
        const user=await userdb.findOne({email:req.session.email})
            
          
            res.render('user/oderPlaced',{user})
        
    } catch (error) {
        console.log(error);
        res.status(400).render('error500')

    }
}  


const onlinepayment=async(req,res)=>{
    try {
       
    
        const totalAmount = req.body.totalamount;

        const order =await razorpay.orders.create({
            amount: totalAmount * 100,
            currency: 'INR',
            payment_capture:1
        });


        res.json({ order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating Razorpay order' });
    }
}


const onlinepayed=async(req,res)=>{
    try {
      
        const { data, paymentMethod,total} = req.query;
        
        
        const parsedData = JSON.parse(data)
        const { items, addressId } = parsedData;


        const address = await addressdb.findById(addressId);
       
        if (!address) {
            return res.status(401).json({ message: 'Address not found', status: 401 });
        }


        const User = await userdb.findOne({ email: req.session.email });
        if (!User) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userId = User._id;



        const updatedProducts = [];
        for (const item of items) {
            const productId = item.productId;
           

            const product = await productdb.findById(productId);
            if (!product) {
                console.log(`Product with ID ${productId} not found`);
                continue;
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Product with ID ${productId} is out of stock` });
            }

            product.stock -= item.quantity;
            product.count += 1;

            await product.save();

            updatedProducts.push({
                productId: productId,
                price: product.price,
                quantity: item.quantity,
            });
        }
      
       
      
       
        const order = new orderdb({
            userId: userId,
            items: updatedProducts,
            totalAmount: total,
            address: address,
            paymentMethod: paymentMethod,
            paymentStatus:"Completed",
            status:'Pending'
        });

        await order.save();

        await cartdb.findOneAndDelete({ user: userId });


        res.redirect('/thankyou')
 


    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const walletpay=async(req,res)=>{
    try {
        const {totalamount,data, paymentMethod, } = req.body;
        
    const { items, addressId } = data;
    const address = await addressdb.findById(addressId);
    if (!address) {
        return res.status(401).json({ message: 'Address not found', status: 401 });
    }
    const User = await userdb.findOne({ email: req.session.email });
    if (!User) {
        return res.status(404).json({ message: 'User not found' });
    }
     const userId = User._id;

       

        const updatedProducts = [];
        for (const item of items) {
            const productId = item.productId;
       

            const product = await productdb.findById(productId);
            
            if (!product) {
                console.log(`Product with ID ${productId} not found`);
                continue;
            }
             
            if (product.stock < item.quantity) {
               
                return res.status(400).json({ message: `Product with ID ${productId} is out of stock` });
            }

            product.stock -= item.quantity;
            product.count += 1;
            await product.save();  
            
            updatedProducts.push({
                productId: productId,
                price: product.price,
                quantity: item.quantity,
            });

           }            
      
            const order = new orderdb({
            userId: userId,
            items: updatedProducts,
            totalAmount: totalamount,
            address: address,
            paymentMethod: paymentMethod,
            paymentStatus:'Completed',
            status: 'Pending'
        });
         
        await order.save();


        const wallet=await walletdb.findOne({user:User._id})


        
        
    
            updatedWallet = await walletdb.findOneAndUpdate(
              { user: User._id },
              {
                $inc: { balance: -totalamount },
                $push: { transactions: { type: 'withdrawl', amount: totalamount, description: `Order cancelled for item ` } }
              },
              { upsert: true, new: true }
            );
          
        
           
        await cartdb.findOneAndDelete({ user: userId });
        res.json({message:"completed"})

    } catch (error) {
        console.log(error);
        res.redirect('/error500')
    }




}



const apply_coupon=async(req,res)=>{
  const {couponCode,totalAmount}=req.body

  const coupon= await coupondb.findOne({couponcode:couponCode})
  if (!coupon || coupon.expireDate < new Date() ) {
    return res.status(400).json({ message: ' expired coupon' })
}
if ( coupon.minPurchaseAmount > totalAmount) {
    return res.status(400).json({ message: `Purchase${coupon.minPurchaseAmount} above`  })
}
const discount = parseInt((totalAmount) * (coupon.discountPercentage)) / 100
        
        const newTotalAmount = Math.round(parseInt(totalAmount) - discount)
        
            
        res.json({newTotalAmount,discount});


}


const failpayment=async(req,res)=>{
    try {
        const { data } = req.body;
        const parsedData = data; // Directly use data if already an object
        const { items, addressId, paymentMethod } = parsedData;

        const userEmail = req.session.email;
        const user = await userdb.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userId = user.id;

        console.log(items, addressId, 'adddd');

        const address = await addressdb.findById(addressId);
        if (!address) {
            return res.status(401).json({ message: 'Address not found' });
        }

        const updatedProducts = [];
        for (const item of items) {
            const productId = item.productId;
            console.log('productId', productId);

            const product = await productdb.findById(productId);
            if (!product) {
                console.log(`Product with ID ${productId} not found`);
                continue;
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Product with ID ${productId} is out of stock` });
            }

            product.stock -= item.quantity;
            product.count += 1;
            await product.save();

            updatedProducts.push({
                productId: productId,
                price: product.price,
                quantity: item.quantity,
            });
        }

        const totalAmount = updatedProducts.reduce((total, item) => total + item.price * item.quantity, 0);

        const order = new orderdb({
            userId: userId,
            items: updatedProducts,
            totalAmount: totalAmount,
            address: address,
            paymentMethod: paymentMethod,
            paymentStatus: "Pending",
            status: 'Pending'
        });

        await order.save();

        await cartdb.findOneAndDelete({ user: userId });

        res.status(200).json({ message: 'Order saved successfully', order });
    } catch (error) {
        console.log(error);
        res.redirect('/error500');
    }
}


const retrypayment=async(req,res)=>{
    const { orderId } = req.body;
       
    try {
       
        const order = await orderdb.findById(orderId);
      
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Create a new Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: order.totalAmount * 100, // 
            currency: 'INR',
            payment_capture: 1
        });

        res.json({ success: true, order: razorpayOrder });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ success: false, message: 'Error creating Razorpay order' });
    }
}


const paymentSucces = async (req, res) => {
    try {
        const orderId = req.query.orderId;
        
        const order = await orderdb.findById(orderId);
        order.status = 'Pending';
        order.paymentStatus = 'Completed';
        order.paymentMethod='online'
        await order.save();
        return res.redirect('/userorders')


    } catch (error) {
        console.log(error);
        res.redirect('/error500');

    }
}



module.exports={
    get_checkout,cod,check_stock,placed,onlinepayment,onlinepayed,walletpay,apply_coupon,failpayment,retrypayment,paymentSucces
}