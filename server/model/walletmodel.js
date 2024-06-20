const mongoose=require('mongoose');

const walletSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,
        ref:'userdb',
        required:true,
        unique:true
    },
    balance:{type:Number,default:0},
    transactions:[
        {
            type:{type:String,
                enum:['deposit','withdrawl','refund'],
                required:true
            },
            amount:{type:Number,required:true},
            timestamp:{type:Date,default:Date.now},
            description:{type:String}
        }
    ]

})


const wallet=mongoose.model('Wallet',walletSchema)
module.exports=wallet