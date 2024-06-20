const mongoose=require("mongoose")


const userSchema= new mongoose.Schema({
    name:{
        type:String,
        trim:true,
    },
    email:{
          type:String,
          trim:true,
          required:true,
    },
    googleId:{
        type:String
    },
    gender:String,
    status:{
        type:String,
        default:'active'
    },
    createdAt:{
        type:Date,
        default:()=> new Date().toISOString().split('T')[0]
    },
    password:{
        type:String
    },
    profilePicture:{
        type:String
    }
},
   {
    timestamps:true
   })


   const userdb=mongoose.model('userdb',userSchema)
   module.exports=userdb 