const mongoose=require('mongoose')

var couponSchema=new mongoose.Schema({
    couponcode:{
        type:String
    },
    expireDate:{
        type:Date
    },
    minPurchaseAmount:{
        type:Number
    },
    discountPercentage:{
        type:Number

    }
})

const coupondb=mongoose.model('coupondb',couponSchema)


module.exports=coupondb;