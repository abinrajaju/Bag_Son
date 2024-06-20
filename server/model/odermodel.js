const mongoose=require('mongoose')


const orderSchema= new mongoose.Schema({
   
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userdb'
    },
    items:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product',
        },
        price:{
            type:Number
        },
        quantity:{
            type:Number
        }
    }],
    orderedDate:{
        type:Date,
        default:()=> new Date().toISOString().split('T')[0]
    },
    deliveredDate:{
        type:Date
    },
    expectedDeliveryDate:{
        type:Date
    },
    status: {
        type: String,
        default: "Pending",
        enum: ['Pending', 'Shipped', 'Processing', 'Delivered', 'Cancelled', 'Returned']
    },
    returned: {
        type: Boolean,
        default: false
    },

    shippingAddress:{
        type:{}
    },
    paymentMethod:{
        type:String
    },
    paymentStatus: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Cancelled', 'Refunded'],
     

            
    },
    totalAmount:{
        type:Number,
        required:true
    },
    address:{
        type:{}
    }
})


const orderdb=mongoose.model('orderdb',orderSchema)

module.exports=orderdb