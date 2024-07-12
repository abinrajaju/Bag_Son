const orderdb=require('../../model/odermodel')
const productdb= require('../../model/product')
const moment=require('moment')


const get_order=async(req,res)=>{
    const orders = await orderdb.find().populate('items.productId').populate('userId').exec();
    orders.reverse()
    res.render('admin/order_detail',{orders,moment})
}
const updateStatus=async(req,res)=>{
    try {
        const orderId = req.params.orderId;
        const newStatus = req.body.status;
        const newPaymentStatus = req.body.paymentStatus;
        
        const updatedOrder = await orderdb.findByIdAndUpdate(orderId, { status: newStatus, paymentStatus: newPaymentStatus }, { new: true });
        const order = await orderdb.findById(orderId);
        

        for (const item of order.items) {
            const product = await productdb.findById(item.productId);

            if (product) {
                product.stock += item.quantity;
                await product.save();
            } else {
                console.log(`Product with ID ${item.productId} not found`);
            }
        }

        res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to update order status' });
    }
}

const orderDetail = async (req, res) => {

    try {
        const orderId = req.params.id
        const order = await orderdb.findById(orderId).populate('items.productId')
       
        res.render('admin/order_view', { order })

    } catch (error) {
        console.log(error);
        res.redirect('/error500')

    }
}


const updateReturn= async(req,res)=>{

    try {
     
     const oder= await orderdb.findById(req.params.id)
     const user = await userdb.findById(oder.userId)
     const wallet = await walletdb.findOne({ user: oder.userId })
        
     let totalRefund = 0;
      let updatedWallet;

     for (const item of oder.items) {
         await productdb.findByIdAndUpdate(item.productId, {
           $inc: { stock: item.quantity },
         });
   
         
     }
         
         if (!wallet) {
           const wallett = new walletdb({
             user: user,
             balance: oder.totalAmount,
             transactions: { type: 'refund', amount: oder.totalAmount, description: `Order Returned for item ` }
   
           })
           wallett.save()
         } else {
   
           updatedWallet = await walletdb.findOneAndUpdate(
             { user: oder.userId },
             {
               $inc: { balance: oder.totalAmount },
               $push: { transactions: { type: 'refund', amount: oder.totalAmount, description: `Order Returned for item` } }
             },
             { upsert: true, new: true }
           );
         }
   
   
     res.status(200).json("data")
     

    } catch (error) {
     console.log(error);
     res.redirect('/error500')
    }
    
}



module.exports={
    get_order,updateStatus,updateReturn,orderDetail
}