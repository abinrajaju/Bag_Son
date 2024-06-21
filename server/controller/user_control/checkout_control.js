const addressdb=require('../../model/addressmodel')
const userdb=require('../../model/usermodel')
const productdb=require('../../model/product')
const cartdb=require('../../model/cartmodel')
const orderdb=require('../../model/odermodel')

const Razorpay=require('razorpay')


var razorpay = new Razorpay({
    key_id: 'rzp_test_K8UOfpQbtMjHOa',
    key_secret: 'dSFQLBx52LesmPYUchtq7c06',
  });


   


const get_checkout= async(req,res)=>{

    
    const user=await userdb.findOne({email:req.session.email})
    const products=await cartdb.findOne({user:user._id}).populate('items.productId')
    
    const address=await addressdb.find({user:user._id})
    res.render('user/checkout',{address,products})
}


const oder_place=async(req,res)=>{
    try {
       
        const { data, paymentMethod } = req.body;
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
            await product.save();

            updatedProducts.push({
                productId: productId,
                price: product.price,
                quantity: item.quantity,
            });
        }
        let discount=0
        const totalAmount = updatedProducts.reduce((total, item) => total + item.price * item.quantity, 0);
        let finalAmount = totalAmount;
        const usercart=await cartdb.findOne({user:User._id}).populate('items.productId')
        usercart.items.forEach(item => {
            const { productId, quantity } = item;   
            
             discount+=productId.discount;
            
            
           
        })
      
        if (discount && discount > 0) {

            finalAmount = totalAmount - discount;
        }

           
        const order = new orderdb({
            userId: userId,
            items: updatedProducts,
            totalAmount: finalAmount,
            address: address,
            paymentMethod: paymentMethod
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
        console.log("Processing stock result...");
        const { data, paymentMethod } = req.query;
        console.log(paymentMethod);
        const parsedData = JSON.parse(data)
        const { items, addressId } = parsedData;

        console.log(parsedData, "daata");
        console.log(paymentMethod);


        const address = await addressdb.findById(addressId);
        console.log(address);
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
            paymentStatus:"Completed",
            status:'Shipped'
        });

        await order.save();

        await cartdb.findOneAndDelete({ user: userId });


        res.redirect('/thankyou')
 


    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports={
    get_checkout,oder_place,check_stock,placed,onlinepayment,onlinepayed
}