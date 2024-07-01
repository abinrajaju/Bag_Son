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



module.exports={
    get_order,updateStatus,orderDetail
}